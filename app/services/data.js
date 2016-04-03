'use strict';
var util = require('util');
module.exports = function (mycro) {
  var getIncludes = function (model) {
    var includeArray = [];
    if (model.hasOwnProperty('include')) {
      model.include().forEach(function (modelName) {
        if (util.isString(modelName)) {
          if (mycro.models.hasOwnProperty(modelName)) {
            includeArray.push(mycro.models[modelName]);
          }
        } else if (util.isObject(modelName)) {
          if (mycro.models.hasOwnProperty(modelName['model'])) {
            includeArray.push({model: mycro.models[modelName['model']], as: modelName['alias']});
          }
        }
      });
    }
    return includeArray;
  };
  return {
    create: function (model, values, cb) {
      model.create(values).then(function (data) {
        return cb(null, data);
      }).catch(function (errors) {
        return cb(errors, null);
      });
    },

    detail: function (model, id, cb) {
      model.findOne({where: {entity_id: id}, include: getIncludes(model)}).then(function (data) {
        return cb(null, data);
      }).catch(function (errors) {
        return cb(errors, null);
      });
    },

    findWithCriteria: function (model, criteria, addIncludes, cb) {
      console.log(model);
      if (addIncludes) {
        criteria.include = getIncludes(model);
      }
      console.log(criteria);
      model.findAll(criteria).then(function (data) {
        return cb(null, data);
      }).catch(function (errors) {
        return cb(errors, null);
      });
    },

    find: function (model, criteria, cb) {
      model.findAll({where: criteria, include: getIncludes(model)}).then(function (data) {
        return cb(null, data);
      }).catch(function (errors) {
        return cb(errors, null);
      });
    },

    remove: function (model, id, cb) {
      model.destroy({where: {entity_id: id}}).then(function (data) {
        return cb(null, data);
      }).catch(function (errors) {
        return cb(errors, null);
      });
    },

    update: function (model, id, values, cb) {
      model.update(values, {entity_id: id}).then(function (count, data) {
        return cb(null, data);
      }).catch(function (errors) {
        return cb(errors, null);
      });
    }
  };
};