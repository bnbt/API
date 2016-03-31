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
        }
    };
};
