const db = require('../setup');
const { DataTypes } = require('sequelize');

const Project = db.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    location: {
        type: DataTypes.STRING,
        allowNull: false
    },

    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: 'ongoing',
        validate: {
            isIn: [['ongoing', 'completed', 'paused']]
        }
    }
}, {
    timestamps: true
});


//export
module.exports = Project;