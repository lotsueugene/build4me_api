const db = require('./setup');
const User = require('./models/users');
const Project = require('./models/projects');
const Update = require('./models/updates');
const Inspection = require('./models/inspections')


//Define relationships

// Projects (Client owns project)
User.hasMany(Project, { foreignKey: 'clientId', as: 'ownedProjects' });
Project.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

// Projects (Contractor assigned to project)
User.hasMany(Project, { foreignKey: 'contractorId', as: 'assignedProjects' });
Project.belongsTo(User, { foreignKey: 'contractorId', as: 'contractor' });


// Updates
Project.hasMany(Update, { foreignKey: 'projectId' });
Update.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(Update, { foreignKey: 'userId' });
Update.belongsTo(User, { foreignKey: 'userId' }); // contractor who posted


// Inspections
Project.hasMany(Inspection, { foreignKey: 'projectId' });
Inspection.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(Inspection, { foreignKey: 'inspectorId' });
Inspection.belongsTo(User, { foreignKey: 'inspectorId' }); // inspector

Update.hasOne(Inspection, { foreignKey: 'updateId' });
Inspection.belongsTo(Update, { foreignKey: 'updateId' }); // inspection tied to update


//Export
module.exports = {
  db,
  User,
  Project,
  Update,
  Inspection
};