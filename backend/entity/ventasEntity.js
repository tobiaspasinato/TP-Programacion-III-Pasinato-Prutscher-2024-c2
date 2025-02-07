const sequelize = require("../database/sequelize.js");
const { DataTypes } = require("sequelize");

const ventasSequelize = sequelize.define(
    "Ventas",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        createdAt: "creado_en",
    }
);

module.exports = ventasSequelize;