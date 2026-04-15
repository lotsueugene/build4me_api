const db = require('../setup');
const { DataTypes } = require('sequelize');

const Inspection = db.define('Inspection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['verified', 'rejected']]
        }
    },

    comments: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    inspectionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },

    inspectorId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },

    updateId: {
    type: DataTypes.INTEGER,
    allowNull: true
    }
    }, 
    {
        timestamps: true
    });


//export
module.exports = Inspection;