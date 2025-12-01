const { Property, User } = require("../models");

// Create a new property (for posting)
exports.createProperty = async (req, res) => {
  try {
    console.log('📨 Create Property Request Received');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Request Headers:', req.headers);
    console.log('Authenticated User:', req.user);
    
    // Get real user ID from auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. User ID not found."
      });
    }

    const userId = req.user.id;
    console.log('✅ Using authenticated user ID:', userId);

    const {
      // Step 1: Basic Details
      purpose,
      propertyType,
      propertySubType,

      // Step 2: Location Details
      city,
      locality,
      subLocality,
      apartment,

      // Step 3: Property Profile
      bedrooms,
      bathrooms,
      balconies,
      plotArea,
      areaUnit,
      carpetArea,
      builtUpArea,
      totalFloors,
      availabilityStatus,
      propertyAge,
      ownership,
      expectedPrice,
      pricePerSqFt,
      allInclusivePrice,
      taxExcluded,
      priceNegotiable,
      propertyDescription,

      // Step 4: Photos & Videos
      photos,
      video,

      // Step 5: Amenities
      otherRooms,
      furnishing,
      coveredParking,
      openParking,
      amenities,
      propertyFeatures,
      societyFeatures,
      additionalFeatures,
      waterSource,
      overlooking,
      otherFeatures,
      powerBackup,
      propertyFacing,
      flooringType,
      locationAdvantages
    } = req.body;

    console.log('Creating property with data:', {
      userId,
      city,
      locality,
      photos: Array.isArray(photos) ? 'Array' : typeof photos,
      amenities: Array.isArray(amenities) ? 'Array' : typeof amenities
    });

    // Create property with all fields
    // For PostgreSQL ARRAY types: pass arrays directly, NOT stringified
    // For JSONB types: pass objects directly, NOT stringified
    const property = await Property.create({
      userId,
      purpose,
      propertyType,
      propertySubType,
      city,
      locality,
      subLocality,
      apartment,
      bedrooms,
      bathrooms,
      balconies,
      plotArea,
      areaUnit,
      carpetArea,
      builtUpArea,
      totalFloors,
      availabilityStatus,
      propertyAge,
      ownership,
      expectedPrice,
      pricePerSqFt,
      allInclusivePrice,
      taxExcluded,
      priceNegotiable,
      propertyDescription,
      
      // ✅ Pass arrays directly for PostgreSQL ARRAY type
      photos: photos || [],
      video,
      otherRooms: otherRooms || [],
      furnishing,
      coveredParking: coveredParking || 0,
      openParking: openParking || 0,
      amenities: amenities || [],
      propertyFeatures: propertyFeatures || [],
      societyFeatures: societyFeatures || [],
      additionalFeatures: additionalFeatures || [],
      waterSource: waterSource || [],
      overlooking: overlooking || [],
      
      // ✅ Pass object directly for JSONB type
      otherFeatures: otherFeatures || {
        gatedSociety: false,
        cornerProperty: false,
        petFriendly: false,
        wheelchairFriendly: false
      },
      
      powerBackup,
      propertyFacing,
      flooringType,
      locationAdvantages: locationAdvantages || [],
      // Auto-approve if posted by admin, otherwise pending
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    console.log('✅ Property created successfully:');
    console.log('Property ID:', property.id);
    console.log('User ID:', property.userId);
    console.log('City:', property.city);
    console.log('Locality:', property.locality);
    
    res.status(201).json({
      success: true,
      message: "Property posted successfully",
      property
    });
  } catch (err) {
    console.error('❌ Create property error:');
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    if (err.errors) {
      console.error('Validation Errors:', err.errors);
    }
    res.status(500).json({
      success: false,
      error: "Failed to create property",
      details: err.message,
      validationErrors: err.errors
    });
  }
};

// Get all properties (admin can see all: pending, approved, rejected)
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'userName', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // No need to parse - PostgreSQL returns arrays and JSONB objects directly
    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (err) {
    console.error("Get properties error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch properties",
      details: err.message
    });
  }
};

// Get single property by ID
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

    // No need to parse - PostgreSQL returns arrays and JSONB objects directly
    res.status(200).json({
      success: true,
      property
    });
  } catch (err) {
    console.error("Get property error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch property",
      details: err.message
    });
  }
};

// Approve a property
exports.approveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    property.status = "approved";
    await property.save();

    res.status(200).json({
      success: true,
      message: "Property approved successfully",
      property
    });
  } catch (err) {
    console.error("Approve property error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to approve property",
      details: err.message
    });
  }
};

// Reject a property
exports.rejectProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    property.status = "rejected";
    await property.save();

    res.status(200).json({
      success: true,
      message: "Property rejected successfully",
      property
    });
  } catch (err) {
    console.error("Reject property error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to reject property",
      details: err.message
    });
  }
};

// Delete a property
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

    await property.destroy();

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (err) {
    console.error("Delete property error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete property",
      details: err.message
    });
  }
};

// Get All Properties for Admin (with filters and pagination)
exports.getAllPropertiesForAdmin = async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const {
      status = 'all',
      propertyType = 'all',
      purpose = 'all',
      category = 'all',
      city = '',
      search = '',
      page = 1,
      limit = 20
    } = req.query;

    // Build where clause
    const whereClause = {};

    if (status !== 'all') {
      whereClause.status = status;
    }

    if (propertyType !== 'all') {
      whereClause.propertyType = propertyType;
    }

    if (purpose !== 'all') {
      whereClause.purpose = purpose;
    }

    if (city) {
      whereClause.city = { [Op.iLike]: `%${city}%` };
    }

    if (search) {
      whereClause[Op.or] = [
        { city: { [Op.iLike]: `%${search}%` } },
        { locality: { [Op.iLike]: `%${search}%` } },
        { propertyDescription: { [Op.iLike]: `%${search}%` } },
        { apartment: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Category filters
    if (category !== 'all') {
      switch (category) {
        case 'featured':
          whereClause.isFeatured = true;
          break;
        case 'topPick':
          whereClause.isTopPick = true;
          break;
        case 'highlighted':
          whereClause.isHighlighted = true;
          break;
        case 'investment':
          whereClause.isInvestmentProperty = true;
          break;
        case 'recent':
          whereClause.isRecentlyAdded = true;
          break;
      }
    }

    const offset = (page - 1) * limit;

    const { count, rows: properties } = await Property.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'userName', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: {
        properties,
        count: properties.length,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (err) {
    console.error("Error fetching properties for admin:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch properties",
      details: err.message
    });
  }
};

// Update Property Categorization
exports.updatePropertyCategorization = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const updateData = req.body;

    // Validate the property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
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
      message: "Property categorization updated successfully",
      property: updatedProperty
    });
  } catch (err) {
    console.error("Error updating property categorization:", err);
    res.status(500).json({
      success: false,
      error: "Update failed",
      details: err.message
    });
  }
};

// Bulk Update Property Categorization
exports.bulkUpdatePropertyCategorization = async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const { propertyIds, ...updateData } = req.body;

    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Property IDs are required"
      });
    }

    // Update all properties
    const [updatedCount] = await Property.update(updateData, {
      where: {
        id: {
          [Op.in]: propertyIds
        }
      }
    });

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} properties`,
      updatedCount
    });
  } catch (err) {
    console.error("Error bulk updating properties:", err);
    res.status(500).json({
      success: false,
      error: "Bulk update failed",
      details: err.message
    });
  }
};
