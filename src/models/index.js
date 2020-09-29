/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
require('dotenv').config();

const config = require('config');

const dbConfig = config.get('database');
const db = {};
let sequelize;
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
console.log('dbConfig: ', dbConfig);
if (dbConfig.use_env_variable) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        dialect: 'mysql',
        logging: null,
        freezeTableName: false,
        operatorsAliases: Sequelize.Op,
        // timezone: '+00:00',
        dialectOptions: {
            dateStrings: true,
            typeCast(field, next) { // for reading from database
                if (field.type === 'DATETIME') {
                    return field.string();
                }
                return next();
            },
        },
        pool: {
            max: 10,
            min: 0,
            idle: 10000,
            acquire: 60000,
        },
    });
}

fs.readdirSync(__dirname)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
