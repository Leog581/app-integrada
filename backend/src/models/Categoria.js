const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
class Categoria extends Model {}
Categoria.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING }
}, { sequelize, modelName: 'Categoria', tableName: 'Categorias', timestamps: true });
module.exports = Categoria;
