'use strict';

module.exports = function (mycro) {
    return {
        //'v1.0.0': {
        //    '/healthy': {
        //        get(req, res) {
        //            res.json(200, {status: 'healthy'});
        //        }
        //    },
        //    '/': {
        //        get(req, res) {
        //            res.send("Hello world!");
        //        }
        //    },
        //    '/devices': {
        //        get: 'device.findAll'
        //    },
        '/device/:id': {
            policies: [
                mycro.policies.validate('query', function (joi) {
                    return joi.object({
                        id: joi.number().integer().required()
                    })
                }, {
                    allowUnknown: true,
                    error: {
                        status: 400,
                        error: 'You fucked up'
                    }
                })
            ],
            options: {
                model: 'device'
            },
            routes: 'crud',
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
        }
    };
};
