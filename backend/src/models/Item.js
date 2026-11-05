const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
class Item extends Model {}
Item.init({
    codigo: { type: DataTypes.STRING(50), allowNull: false },
    descripcion: { type: DataTypes.STRING(255), allowNull: false },
    unidad: { type: DataTypes.STRING(50), allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 }
}, { sequelize, modelName: 'Item', tableName: 'inventario', timestamps: true });
module.exports = Item;
