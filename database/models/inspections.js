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
    }
}, {
    timestamps: true
});


//export
module.exports = Inspection;