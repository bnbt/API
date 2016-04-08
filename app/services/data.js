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
        },
        getOrder = function (model) {
            if (model.hasOwnProperty('order')) {
                return model.order(mycro.models);
            }
            return [];
        },

        setStates = function (values, device, cb) {
            mycro.models['state'].findAll({where: {entity_id: values.deviceStates}}).then(function (states) {
                device.setDeviceStates([]).then(function () {
                    let promises = [];
                    states.forEach(function(state, index) {
                        promises.push(device.addDeviceState(state, {sort_order: index}));
                    });
                    return Promise.all(promises);
                }).then(function() {
                    return cb(null, device);
                }).catch(function (errors) {
                    return cb(errors, null);
                });
            }).catch(function (errors) {
                return cb(errors, null);
            });
        },
        findPromise = function (model, criteria) {
            return model.findAll({
                where: criteria,
                include: getIncludes(model),
                order: getOrder(model) || []
            })
        };

    return {
        findPromise: findPromise,
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
        remove: function (model, id, cb) {
            model.destroy({where: {entity_id: id}}).then(function (data) {
                return cb(null, data);
            }).catch(function (errors) {
                return cb(errors, null);
            });
        },

        update: function (model, id, values, cb) {
            model.findById(id).then(function (data) {
                data.updateAttributes(values).then(function (count, data) {
                    return cb(null, data);
                }).catch(function (errors) {
                    return cb(errors, null);
                });
            }).catch(function (errors) {
                return cb(errors, null);
            });
        },
        createDevice: function (model, values, cb) {
            model.create(values).then(function (data) {
                if (values.hasOwnProperty('deviceStates') && util.isArray(values.deviceStates)) {
                    return setStates(values, device, cb);
                }
                return cb(null, data);
            }).catch(function (errors) {
                return cb(errors, null);
            });
        },
        updateDevice: function (model, id, values, cb) {
            model.findById(id).then(function (device) {
                device.updateAttributes(values).then(function (count, data) {
                    if (values.hasOwnProperty('deviceStates') && util.isArray(values.deviceStates)) {
                        return setStates(values, device, cb);
                    }
                    return cb(null, data);
                }).catch(function (errors) {
                    return cb(errors, null);
                });
            }).catch(function (errors) {
                return cb(errors, null);
            });
        }
    };
};
