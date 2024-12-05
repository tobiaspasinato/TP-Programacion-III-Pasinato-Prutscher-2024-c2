const sequelize = require("../database/sequelize.js");
const { DataTypes } = require("sequelize");

const contraSequelize = sequelize.define(
    "Contrasenia",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        encripted: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        eliminado: {
            defaultValue: false,
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        createdAt: "creado_en",
    }
);

module.exports = contraSequelize;