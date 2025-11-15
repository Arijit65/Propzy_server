'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      // Property belongs to a User (the owner/poster)
      Property.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
    }
  }

  Property.init({
    // User reference
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
      // TODO: Re-enable foreign key constraint after user authentication is properly implemented
      // references: {
      //   model: 'Users',
      //   key: 'id'
      // }
    },

    // Step 1: Basic Details
    purpose: {
      type: DataTypes.ENUM('Sell', 'Rent / Lease', 'PG'),
      allowNull: false,
      defaultValue: 'Sell'
    },
    propertyType: {
      type: DataTypes.ENUM('Residential', 'Commercial'),
      allowNull: false,
      defaultValue: 'Residential'
    },
    propertySubType: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Step 2: Location Details
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subLocality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apartment: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Step 3: Property Profile - Room Details
    bedrooms: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bathrooms: {
      type: DataTypes.STRING,
      allowNull: true
    },
    balconies: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Area Details
    plotArea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    areaUnit: {
      type: DataTypes.STRING,
      defaultValue: 'sq.ft.'
    },
    carpetArea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    builtUpArea: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Floor Details
    totalFloors: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Availability & Age
    availabilityStatus: {
      type: DataTypes.ENUM('Ready to move', 'Under construction'),
      defaultValue: 'Ready to move'
    },
    propertyAge: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Ownership
    ownership: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Price Details
    expectedPrice: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pricePerSqFt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    allInclusivePrice: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    taxExcluded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    priceNegotiable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // Property Description
    propertyDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // Step 4: Photos & Videos
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Step 5: Amenities
    otherRooms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    furnishing: {
      type: DataTypes.STRING,
      allowNull: true
    },
    coveredParking: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    openParking: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    propertyFeatures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    societyFeatures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    additionalFeatures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    waterSource: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    overlooking: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    otherFeatures: {
      type: DataTypes.JSONB,
      defaultValue: {
        gatedSociety: false,
        cornerProperty: false,
        petFriendly: false,
        wheelchairFriendly: false
      }
    },
    powerBackup: {
      type: DataTypes.ENUM('None', 'Partial', 'Full'),
      defaultValue: 'None'
    },
    propertyFacing: {
      type: DataTypes.STRING,
      allowNull: true
    },
    flooringType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    locationAdvantages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },

    // Admin approval status
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },

    // Property visibility
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Property',
    timestamps: true
  });

  return Property;
};
