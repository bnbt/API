'use strict';

module.exports = function(mycro) {
    return {
        create: function(model, values, cb) {
            model.create(values).then(function(data){
                return cb(null, data);
            }).catch(function(errors) {
                return cb(errors, null);
            });
        },

        detail: function(model, id, cb) {
            model.findOne({where: {entity_id: id}}).then(function(data){
                return cb(null, data);
            }).catch(function(errors) {
                return cb(errors, null);
            });
        },

        find: function(model, criteria, cb) {
            model.findAll({where: criteria}).then(function(data){
                return cb(null, data);
            }).catch(function(errors) {
                return cb(errors, null);
            });
        },

        remove: function(model, id, cb) {
            model.destroy({where: {entity_id: id}}).then(function(data){
                return cb(null, data);
            }).catch(function(errors) {
                return cb(errors, null);
            });
        },

        update: function(model, id, values, cb) {
            model.update(values, {entity_id: id}).then(function(count, data){
                return cb(null, data);
            }).catch(function(errors) {
                return cb(errors, null);
            });
        }
    };
};