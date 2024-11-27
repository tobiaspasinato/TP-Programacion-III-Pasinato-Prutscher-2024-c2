const sequelize = require("../database/sequelize.js");
const { DataTypes } = require("sequelize");

const productoSequelize = sequelize.define(
    "Producto",
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
        precio: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo: {
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

module.exports = productoSequelize;