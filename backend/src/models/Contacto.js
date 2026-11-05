const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Contacto extends Model {}
Contacto.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paterno: { type: DataTypes.STRING, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    categoriaId: { type: DataTypes.INTEGER, allowNull: false } 
}, { 
    sequelize, 
    modelName: 'Contacto', 
    tableName: 'Contactos', 
    timestamps: true 
});

module.exports = Contacto;