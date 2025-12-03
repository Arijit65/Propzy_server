'use strict';

module.exports = (sequelize, DataTypes) => {
  const Enquiry = sequelize.define('Enquiry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Common fields for all enquiries
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    // Fields from HomePage EnquiryForm
    enquiryType: {
      type: DataTypes.ENUM('buy', 'sell', 'rent'),
      allowNull: true,
      comment: 'Type of enquiry from home page form'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Preferred location from home page form'
    },
    
    // Fields from PropertyDetailPage contact form
    userType: {
      type: DataTypes.ENUM('Individual', 'Dealer'),
      allowNull: true,
      comment: 'User type from property detail page'
    },
    reason: {
      type: DataTypes.ENUM('Investment', 'Self Use'),
      allowNull: true,
      comment: 'Reason to buy from property detail page'
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Properties',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      comment: 'Property reference if enquiry is from property detail page'
    },
    
    // Enquiry source and status
    source: {
      type: DataTypes.ENUM('home', 'property_detail', 'other'),
      defaultValue: 'home',
      allowNull: false,
      comment: 'Source of the enquiry'
    },
    status: {
      type: DataTypes.ENUM('pending', 'contacted', 'resolved', 'closed'),
      defaultValue: 'pending',
      allowNull: false
    },
    
    // Admin notes
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Internal notes by admin for this enquiry'
    },
    contactedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when customer was contacted'
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when enquiry was resolved'
    }
  }, {
    tableName: 'Enquiries',
    timestamps: true,
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['source']
      },
      {
        fields: ['propertyId']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['email']
      }
    ]
  });

  Enquiry.associate = (models) => {
    // Association with Property
    Enquiry.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
  };

  return Enquiry;
};
