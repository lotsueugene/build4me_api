const { DataTypes } = require('sequelize');
const db = require('../setup');


//User model
const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

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
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 100]
        }
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'client',
        validate: {
            notEmpty: true,
            isIn: [['client', 'contractor', 'inspector', 'admin']]
        }
    }

}, {
    timestamps: true
});


//export
module.exports = User;