'use strict';

module.exports = function (mycro) {
    return {
        '/device': {
            options: {
                model: 'device'
            },
            routes: 'crud',

            '/state': {
                policies: [
                    mycro.services['validation'].deviceHeader(),
                    mycro.services['validation'].deviceStateQuery()
                ],
                put: 'device.putState'
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
            routes: 'crud'
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
        }
    };
};
