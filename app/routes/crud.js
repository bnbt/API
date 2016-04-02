module.exports = function(mycro) {
    return {
        get: 'crud.find',
        put: 'crud.create',
        '/:id': {
            policies: [
                // TODO: REMOVE HARDCODE FROM node_modules
                mycro.policies.validate('params', function (joi) {
                    return joi.object({
                        id: joi.number().required()
                    }).required();
                }, {
                    stripUnknown: false,
                    convert: true
                })
            ],
            del: 'crud.destroy',
            get: 'crud.findOne',
            post: 'crud.update'
        }
    }
};