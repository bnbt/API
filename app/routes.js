'use strict';

module.exports = function (mycro) {
    return {
        '/device': {
            get: 'crud.find',
            put: 'device.create',
            '/:id': {
                // policies: [
                //     // TODO: REMOVE HARDCODE FROM node_modules
                //     mycro.policies.validate('params', function (joi) {
                //         return joi.object({
                //             id: joi.number().required()
                //         }).required();
                //     }, {
                //         stripUnknown: false,
                //         convert: true
                //     })
                // ],
                del: 'crud.destroy',
                get: 'crud.findOne',
                post: 'device.update',
                options: {
                    model: 'device'
                }
            },

            '/state': {
                policies: [
                    mycro.services['validation'].deviceHeader(),
                    mycro.services['validation'].deviceStateQuery()
                ],
                put: 'device.putState',
                get: 'device.getState'
            },
            '/config': {
                policies: [
                    mycro.services['validation'].deviceHeader()
                ],
                get: 'device.getConfig'
            }
        },
        '/user': {
            options: {
                model: 'user'
            },
            routes: 'crud',
            
            '/ad': {
                get: 'user.getADUsers'
            }
        },
        '/role': {
            options: {
                model: 'role'
            },
            routes: 'crud'
        },
        '/audit': {
            options: {
                model: 'audit'
            },
            get: 'crud.find'
        },
        '/state': {
            options: {
                model: 'state'
            },
            routes: 'crud'
        }
    };
};
