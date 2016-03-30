'use strict';

module.exports = function(mycro) {
    return {
        create: function(model, values, cb) {
            model.create(values).then(function(data){
                return cb(null, data);
            });
            /**
             * Details of instance here
             */
        },

        detail: function(model, id, cb) {
            model.findOne({where: {entity_id: id}}).then(function(data){
                return cb(null, data);
            });
            /**
             * Details of instance here
             */
        },

        find: function(model, criteria, cb) {
            model.findAll({where: criteria}).then(function(data){
                return cb(null, data);
            });
            /**
             * Find logic here
             */
        },

        remove: function(model, id, cb) {
            /**
             * Delete logic here
             */
        },

        update: function(model, id, values, cb) {
            /**
             * Update logic here
             */
        }
    };
};