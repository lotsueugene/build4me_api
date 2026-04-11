const db = require('./setup');

const User = require('./models/users');
const Project = require('./models/projects');
const Update = require('./models/updates');
const Inspection = require('./models/inspections')


//Define relationships

module.exports = {
  db,
  User,
  Project,
  Update,
  Inspection
};