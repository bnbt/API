'use strict';

module.exports = function (mycro) {
    return {
        '/device': {
            get: 'crud.find',
            put: 'device.create',
            options: {
                model: 'device'
            },

            '/state': {
                policies: [
                    mycro.services['validation'].deviceHeader()
                ],
                put: {
                    additionalPolicies: [
                        mycro.services['validation'].deviceStateQuery()
                    ],
                    handler: 'device.putState'
                },
                get: 'device.getState'
            },

            '/config': {
                policies: [
                    mycro.services['validation'].deviceHeader()
                ],
                get: 'device.getConfig'
            },

            '/:id': {
                policies: [
                    mycro.services['validation'].entityId()
                ],
                del: 'crud.destroy',
                get: 'crud.findOne',
                post: 'device.update',
                options: {
                    model: 'device'
                }
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
            get: 'crud.find',
            put: 'state.create',
            '/:id': {
                policies: [
                    mycro.services['validation'].entityId()
                ],
                del: 'crud.destroy',
                get: 'crud.findOne',
                post: 'state.update',
                options: {
                    model: 'state'
                }
            },
            options: {
                model: 'state'
            },
            routes: 'crud'
        }
    };
};
