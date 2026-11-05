const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
class Proveedor extends Model {}
Proveedor.init({
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: true },
    telefono: { type: DataTypes.STRING(30), allowNull: true },
    direccion: { type: DataTypes.STRING(255), allowNull: true }
}, { sequelize, modelName: 'Proveedor', tableName: 'proveedores', timestamps: true });
module.exports = Proveedor;
