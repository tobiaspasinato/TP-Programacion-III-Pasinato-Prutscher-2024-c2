const sequelize = require("../database/sequelize.js");
const { DataTypes } = require("sequelize");

const ventaProductoSequelize = sequelize.define(
    "ventaProductos", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        createdAt: "creado_en",
    }
);

module.exports = ventaProductoSequelize;