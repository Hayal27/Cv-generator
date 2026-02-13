const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  previewImage: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  htmlTemplate: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  cssStyles: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  category: {
    type: DataTypes.ENUM('professional', 'creative', 'modern', 'classic'),
    defaultValue: 'professional'
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'templates',
  timestamps: true
});

module.exports = Template;