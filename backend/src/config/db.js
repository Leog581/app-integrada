require('dotenv').config();
const { Sequelize } = require('sequelize');
const pg = require('pg');

if(!process.env.DATABASE_URL){
    throw new Error('Falta DATABASE_URL en el archivo .env');
};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    dialectOptions:{ 
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;