const { User, Property } = require("../models");
const cloudinary = require('cloudinary').v2;
const { Op } = require("sequelize");
const path = require('path');
const fs = require('fs');

// Create Property (requires auth)
exports.createProperty = async (req, res) => {
  try {
    const propertyData = req.body;

    console.log("Received property data:", propertyData);

    // Handle photo uploads
    let photoUrls = [];
    if (req.files && req.files.photos) {
      const photoFiles = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];

      for (const photo of photoFiles) {
        try {
          const photoUpload = await cloudinary.uploader.upload(photo.path, {
            resource_type: 'image',
            folder: 'properties/photos'
          });
          photoUrls.push(photoUpload.secure_url);

          // Delete temp file
          if (fs.existsSync(photo.path)) {
            fs.unlinkSync(photo.path);
          }
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError);
          if (fs.existsSync(photo.path)) {
            fs.unlinkSync(photo.path);
          }
        }
      }
    }

    // Handle video upload
    let videoUrl = null;
    if (req.files && req.files.video) {
      const videoFile = req.files.video;
      try {
        const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
          resource_type: 'video',
          folder: 'properties/videos'
        });
        videoUrl = videoUpload.secure_url;

        // Delete temp file
        if (fs.existsSync(videoFile.path)) {
          fs.unlinkSync(videoFile.path);
        }
      } catch (uploadError) {
        console.error('Error uploading video:', uploadError);
        if (fs.existsSync(videoFile.path)) {
          fs.unlinkSync(videoFile.path);
        }
      }
    }

    // Parse JSON fields if they come as strings
    const parseField = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return field;
        }
      }
      return field;
    };

    // Create property with parsed data
    const property = await Property.create({
      userId: req.user.id,

      // Step 1: Basic Details
      purpose: propertyData.purpose,
      propertyType: propertyData.propertyType,
      propertySubType: propertyData.propertySubType,

      // Step 2: Location Details
      city: propertyData.city,
      locality: propertyData.locality,
      subLocality: propertyData.subLocality,
      apartment: propertyData.apartment,

      // Step 3: Property Profile
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      balconies: propertyData.balconies,
      plotArea: propertyData.plotArea,
      areaUnit: propertyData.areaUnit,
      carpetArea: propertyData.carpetArea,
      builtUpArea: propertyData.builtUpArea,
      totalFloors: propertyData.totalFloors,
      availabilityStatus: propertyData.availabilityStatus,
      propertyAge: propertyData.propertyAge,
      ownership: propertyData.ownership,
      expectedPrice: propertyData.expectedPrice,
      pricePerSqFt: propertyData.pricePerSqFt,
      allInclusivePrice: propertyData.allInclusivePrice === 'true' || propertyData.allInclusivePrice === true,
      taxExcluded: propertyData.taxExcluded === 'true' || propertyData.taxExcluded === true,
      priceNegotiable: propertyData.priceNegotiable === 'true' || propertyData.priceNegotiable === true,
      propertyDescription: propertyData.propertyDescription,

      // Step 4: Photos & Videos
      photos: photoUrls,
      video: videoUrl,

      // Step 5: Amenities
      otherRooms: parseField(propertyData.otherRooms) || [],
      furnishing: propertyData.furnishing,
      coveredParking: parseInt(propertyData.coveredParking) || 0,
      openParking: parseInt(propertyData.openParking) || 0,
      amenities: parseField(propertyData.amenities) || [],
      propertyFeatures: parseField(propertyData.propertyFeatures) || [],
      societyFeatures: parseField(propertyData.societyFeatures) || [],
      additionalFeatures: parseField(propertyData.additionalFeatures) || [],
      waterSource: parseField(propertyData.waterSource) || [],
      overlooking: parseField(propertyData.overlooking) || [],
      otherFeatures: parseField(propertyData.otherFeatures) || {
        gatedSociety: false,
        cornerProperty: false,
        petFriendly: false,
        wheelchairFriendly: false
      },
      powerBackup: propertyData.powerBackup,
      propertyFacing: propertyData.propertyFacing,
      flooringType: propertyData.flooringType,
      locationAdvantages: parseField(propertyData.locationAdvantages) || [],

      // Status
      status: 'pending',
      isActive: true
    });

    // Fetch property with user details
    const propertyWithUser = await Property.findByPk(property.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'email', 'userName', 'phone']
        }
      ]
    });

    console.log("Property created successfully:", property.id);
    res.status(201).json({
      success: true,
      message: "Property posted successfully",
      property: propertyWithUser
    });
  } catch (err) {
    console.error("Property creation error:", err);
    res.status(500).json({
      success: false,
      error: "Property creation failed",
      details: err.message
    });
  }
};

// Get All Properties (with optional filters)
exports.getAllProperties = async (req, res) => {
  try {
    const {
      purpose,
      propertyType,
      city,
      locality,
      minPrice,
      maxPrice,
      bedrooms,
      status = 'approved'
    } = req.query;

    // Build where clause
    const whereClause = { status };

    if (purpose) whereClause.purpose = purpose;
    if (propertyType) whereClause.propertyType = propertyType;
    if (city) whereClause.city = city;
    if (locality) whereClause.locality = locality;
    if (bedrooms) whereClause.bedrooms = bedrooms;

    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.expectedPrice = {};
      if (minPrice) whereClause.expectedPrice[Op.gte] = minPrice;
      if (maxPrice) whereClause.expectedPrice[Op.lte] = maxPrice;
    }

    const properties = await Property.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'userName', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch properties",
      details: err.message
    });
  }
};

// Get Property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findByPk(propertyId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'userName', 'email', 'phone']
        }
      ]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    // Check if property is approved or if user owns the property
    if (property.status !== 'approved' && property.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      property
    });
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch property",
      details: err.message
    });
  }
};

// Get Properties by User ID
exports.getPropertiesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const properties = await Property.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'userName', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (err) {
    console.error("Error fetching user properties:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user's properties",
      details: err.message
    });
  }
};

// Get My Properties (current user)
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'userName', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (err) {
    console.error("Error fetching my properties:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch properties",
      details: err.message
    });
  }
};

// Update Property
exports.updateProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const updateData = req.body;

    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    // Check if user owns the property
    if (property.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized"
      });
    }

    // Update property
    await property.update(updateData);

    // Fetch updated property with user details
    const updatedProperty = await Property.findByPk(propertyId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'userName', 'email', 'phone']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty
    });
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({
      success: false,
      error: "Update failed",
      details: err.message
    });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    // Check if user owns the property
    if (property.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized"
      });
    }

    await property.destroy();

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({
      success: false,
      error: "Delete failed",
      details: err.message
    });
  }
};

// Search Properties
exports.searchProperties = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Search query is required"
      });
    }

    const properties = await Property.findAll({
      where: {
        status: 'approved',
        [Op.or]: [
          { city: { [Op.iLike]: `%${query}%` } },
          { locality: { [Op.iLike]: `%${query}%` } },
          { propertyDescription: { [Op.iLike]: `%${query}%` } },
          { apartment: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'userName', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (err) {
    console.error("Error searching properties:", err);
    res.status(500).json({
      success: false,
      error: "Search failed",
      details: err.message
    });
  }
};
