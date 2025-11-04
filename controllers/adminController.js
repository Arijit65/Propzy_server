const { Property, User } = require("../models");

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
