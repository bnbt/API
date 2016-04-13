'use strict';
var sequelizeAdapter = require('../app/adapters/sequelize'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    params = yaml.safeLoad(fs.readFileSync('config/parameters.yml', 'utf8'));
module.exports = {
    mysql: {
        adapter: sequelizeAdapter,
        config: params['db'],
        models: [
            // // include the `/app/models/permissions.js` model explicitly
            // 'permissions',
            // // include all model definitions found in the
            // // `/app/models/blog` folder
            '*'
        ]
    }
};
