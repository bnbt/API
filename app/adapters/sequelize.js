'use strict';

var asyncjs = require('async'),
  Sequelize = require('sequelize'),
  _ = require('lodash');

module.exports = {
  /**
   * Create a valid mysql connection string
   *
   * @param {object} connectionInfo - connection info
   * @param {function} cb - callback
   * @private
   */
  _buildMySQLConnectionString: function (connectionInfo, cb) {
    var connectionString = 'mysql://';

    if (connectionInfo.url) {
      return cb(null, connectionInfo.url);
    }

    // append credentials if provided
    if (connectionInfo.user && connectionInfo.password) {
      if (!connectionInfo.database) return cb('A database must be specified if credentials are being used');
      connectionString += connectionInfo.user + ':' + connectionInfo.password + '@';
    }

    // append host and port
    connectionString += connectionInfo.host + ':' + connectionInfo.port + '/';

    if (connectionInfo.database) {
      connectionString += connectionInfo.database;
    }
    cb(null, connectionString);
  },


  /**
   * Specify adapter defaults
   *
   * @param {object} _defaults
   */
  _defaults: {
    port: 3306,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  },


  /**
   * Expose the raw sequelize library required for this module
   *
   * @type {Object}
   */
  sequelize: Sequelize,


  /**
   * Create a new mongoose connection with the specified connection info
   *
   * @param {object} connectionInfo - connection info from microbrial config
   * @param {function} cb - callback
   */
  registerConnection: function (connectionInfo, cb) {
    var Sequelize = require('sequelize'),
      self = this,
      defaults = self._defaults;

    // get connection options, apply defaults
    _.defaults(connectionInfo, defaults);

    asyncjs.waterfall([
      function getConnectionString(fn) {
        return self._buildMySQLConnectionString(connectionInfo, fn);
      },

      function getConnection(url, fn) {
        var connection = new Sequelize(url);
        connection.sync().then(function () {
          return fn(null, connection);
        }).error(function (err) {
          return fn(err);
        });
      }
    ], cb);
  },


  /**
   * Create a new mongoose model and return it to microbial
   *
   * @param {object} connection - a mongoose connection
   * @param {object} modelDefinition - a model definition
   * @param name
   * @param mycro
   * @param {function} cb - callback
   */
  registerModel: function (connection, modelDefinition, name, mycro, cb) {
    try {
      var model = connection.import(name, modelDefinition);
      model.sync().then(function () {
        return cb(null, model);
      });
    } catch (err) {
      return cb('Error defining sequelize model (' + name + '): ' + err);
    }
  },

  //processModels: function (models, modelDefinitions, _fn) {
  //  try {
  //    asyncjs.each(models, function(model){
  //      if(model.hasOwnProperty('associate')) {
  //        model.associate(models);
  //      }
  //    });
  //  } catch (err) {
  //    return _fn(err);
  //  }
  //}
};
