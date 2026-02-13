const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CV = sequelize.define('CV', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  personalInfo: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  education: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  experience: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  projects: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  achievements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastModified: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cvs',
  timestamps: true,
  hooks: {
    beforeUpdate: (cv) => {
      cv.lastModified = new Date();
    }
  }
});

module.exports = CV;