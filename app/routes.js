'use strict';
const ADMIN = 'ADMIN';
module.exports = function (mycro) {
    return {
        '/device': {
            get: {
                handler: 'crud.find'
            },
            put: {
                policies: [
                    mycro.policies['has_role']('ADMIN'),
                    mycro.services['validation'].deviceValidation()
                ],
                handler: 'device.create'
            },
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
                    mycro.services['validation'].entityId(),
                ],
                del: {
                    additionalPolicies: [
                        mycro.policies['has_role'](ADMIN)
                    ],
                    handler: 'crud.destroy'
                },
                get: 'crud.findOne',
                post: {
                    additionalPolicies: [
                        mycro.policies['has_role'](ADMIN),
                        mycro.services['validation'].deviceValidation()
                    ],
                    handler: 'device.update'
                },
                options: {
                    model: 'device'
                }
            }
        },
        '/user/ad': {
            policies: [
                'is_authenticated'
            ],
            get: 'user.getADUsers'
        },
        '/user': {
            policies: [
                mycro.policies['has_role'](ADMIN)
            ],
            put: {
                handler: 'crud.create',
                additionalPolicies: [
                    mycro.services['validation'].userValidation()
                ]
            },
            post: {
                handler: 'crud.update',
                additionalPolicies: [
                    mycro.services['validation'].userValidation()
                ]
            },
            options: {
                model: 'user'
            },
            routes: 'crud'
        },
        '/role': {
            put: {
                handler: 'crud.create',
                additionalPolicies: [
                    mycro.policies['has_role'](ADMIN),
                    mycro.services['validation'].roleValidation()
                ]
            },
            post: {
                handler: 'crud.update',
                additionalPolicies: [
                    mycro.policies['has_role'](ADMIN),
                    mycro.services['validation'].roleValidation()
                ]
            },
            options: {
                model: 'role'
            },
            routes: 'crud'
        },
        '/audit': {
            options: {
                model: 'audit'
            },
            get: {
                additionalPolicies: [
                    mycro.services['validation'].paginationValidation()
                ],
                handler: 'crud.find'
            }
        },
        '/rfid': {
            policies: [
                mycro.policies['has_role'](ADMIN)
            ],
            options: {
                model: 'audit'
            },
            get: 'audit.rfidList'
        },
        '/state': {
            get: {
                additionalPolicies: [
                    mycro.services['validation'].paginationValidation()
                ],
                handler: 'crud.find'
            },
            put: {
                handler: 'state.create',
                additionalPolicies: [
                    mycro.policies['has_role'](ADMIN),
                    mycro.services['validation'].stateValidation()
                ]
            },
            '/:id': {
                policies: [
                    mycro.policies['has_role'](ADMIN),
                    mycro.services['validation'].entityId()
                ],
                del: 'crud.destroy',
                get: 'crud.findOne',
                post: {
                    handler: 'state.update',
                    additionalPolicies: [
                        mycro.services['validation'].stateValidation()
                    ]
                },
                options: {
                    model: 'state'
                }
            },
            options: {
                model: 'state'
            },
            routes: 'crud'
        } ,
        '/login': {
            policies: [
                mycro.services['validation'].hasCredentials()
            ],
            post: 'user.login'
        } ,
        '/logout': {
            post: {
                handler: 'user.logout',
                policies: [
                    'is_authenticated'
                ]
            }
        }
    };
};
