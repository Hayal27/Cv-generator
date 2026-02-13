const { sequelize } = require('../config/database');
const User = require('./User');
const CV = require('./CV');
const Template = require('./Template');

// Define associations
User.hasMany(CV, { foreignKey: 'userId', as: 'cvs' });
CV.belongsTo(User, { foreignKey: 'userId', as: 'user' });

CV.belongsTo(Template, { foreignKey: 'templateId', as: 'template' });
Template.hasMany(CV, { foreignKey: 'templateId', as: 'cvs' });

module.exports = {
  sequelize,
  User,
  CV,
  Template
};