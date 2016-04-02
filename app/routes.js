'use strict';

module.exports = function (mycro) {
    return {
        '/device': {
            options: {
                model: 'device'
            },
            routes: 'crud'
        },
        '/user': {
            options: {
                model: 'user'
            },
            routes: 'crud'
        },
        '/role': {
            options: {
                model: 'role'
            },
            routes: 'crud'
        },
        '/config': {
            policies: [
                mycro.policies.validate('headers', function (joi) {
                    return joi.object({
                        device: joi.string().required()
                    }).required();
                }, {
                    stripUnknown: true,
                    convert: false
                })
            ],
            get: 'config.get'
        }
    };
};
