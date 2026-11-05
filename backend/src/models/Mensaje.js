const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Mensaje extends Model {}
Mensaje.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    texto: { type: DataTypes.TEXT, allowNull: false }
}, { 
    sequelize, 
    modelName: 'Mensaje', 
    tableName: 'Mensajes', 
    timestamps: true 
});

module.exports = Mensaje;