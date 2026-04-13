const db = require('../setup');
const { DataTypes } = require('sequelize');


const Update = db.define('Update', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true }
    },

    mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'verified', 'rejected']]
        }
    }
}, {
    timestamps: true
});


//export
module.exports = Update;