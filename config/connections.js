'use strict';
var sequelizeAdapter = require('../app/adapters/sequelize');

module.exports = {
    mysql: {
        adapter: sequelizeAdapter,
        config: {
            host: process.env.MYSQL_HOST || 'localhost',
            port: process.env.PORT,
            user: process.env.MYSQL_USERNAME || 'root',
            password: process.env.MYSQL_PASSWORD || 'password',
            database: process.env.MYSQL_DB || 'bnb'
        },
        models: [
            // // include the `/app/models/permissions.js` model explicitly
            // 'permissions',
            // // include all model definitions found in the
            // // `/app/models/blog` folder
            '*'
        ]
    }
};
