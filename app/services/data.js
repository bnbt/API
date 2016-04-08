'use strict';
var util = require('util'),
    Promise = require('bluebird');
module.exports = function (mycro) {
    var models = mycro.models,
        getIncludes = function (model) {
            var includeArray = [];
            if (model.hasOwnProperty('include')) {
                model.include().forEach(function (modelName) {
                    if (util.isString(modelName)) {
                        if (models.hasOwnProperty(modelName)) {
                            includeArray.push(models[modelName]);
                        }
                    } else if (util.isObject(modelName)) {
                        if (models.hasOwnProperty(modelName['model'])) {
                            includeArray.push({model: models[modelName['model']], as: modelName['alias']});
                        }
                    }
                });
            }
            return includeArray;
        },
        getOrder = function (model) {
            if (model.hasOwnProperty('order')) {
                return model.order(models);
            }
            return [];
        },

        setStates = function (values, device) {
            var states = null;
            return models['state']
                .findAll({
                    where: {entity_id: values.deviceStates},
                    order: util.format('FIELD(entity_id, %s)', values.deviceStates.join(', '))
                }).then(function (data) {
                    states = data;
                    return device.setDeviceStates([])
                }).then(function () {
                    let promises = [];
                    states.forEach(function (state, index) {
                        promises.push(device.addDeviceState(state, {sort_order: index}));
                    });
                    return Promise.all(promises);
                })
        },
        findPromise = function (model, criteria) {
            return model.findAll({
                where: criteria,
                include: getIncludes(model),
                order: getOrder(model) || []
            })
        },
        findOnePromise = function (model, criteria) {
            return model.find({
                where: criteria,
                include: getIncludes(model),
                order: getOrder(model) || []
            })
        };

    return {
        findPromise: findPromise,
        findOnePromise: findOnePromise,
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

        find: function (model, criteria, cb) {
            findPromise(model, criteria).then(function (data) {
                return cb(null, data);
            }).catch(function (errors) {
                return cb(errors, null);
            });
        },
        findOne: function (model, criteria, cb) {
            findOnePromise(model, criteria).then(function (data) {
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
            model.findById(id).then(function (data) {
                return data.updateAttributes(values);
            }).then(function (count, data) {
                return cb(null, data);
            }).catch(function (errors) {
                return cb(errors, null);
            });
        },
        createDevice: function (model, values, cb) {
            var device = null;
            model.create(values).then(function (data) {
                device = data;
                if (!values.hasOwnProperty('deviceStates')) {
                    values.deviceStates = [];
                }
                return setStates(values, device, cb);
            }).then(function () {
                return cb(null, device);
            }).catch(function (errors) {
                return cb(errors, null);
            });
        },
        updateDevice: function (model, id, values, cb) {
            var device = null;
            model.findById(id)
                .then(function (data) {
                    device = data;
                    return device.updateAttributes(values);
                })
                .then(function (data) {
                    device = data;
                    return setStates(values, device);
                })
                .then(function () {
                    return cb(null, device);
                })
                .catch(function (errors) {
                    return cb(errors, null);
                });
        }
    };
};
