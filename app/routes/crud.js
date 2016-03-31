module.exports = function(mycro) {
    return {
        get: 'crud.find',
        put: 'crud.create',
        '/:id': {
            policies: [
                // THIS DOES NOT WORK!!! "query" container is empty. we need "params" container
                mycro.policies.validate('query', function (joi) {
                    return joi.object().keys({
                        id: joi.number().required()
                    }).required();
                }, {
                    stripUnknown: true,
                    convert: false,
                    error: {
                        status: 400,
                        error: 'You fucked up'
                    }
                })
            ],
            del: 'crud.destroy',
            get: 'crud.findOne',
            post: 'crud.update'
        }
    }
};