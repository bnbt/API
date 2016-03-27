'use strict';

module.exports = {
    port: 8000,
    middleware: [
        'acceptParser',
        'dateParser',
        'queryParser',
        'bodyParser',
        'morgan',
        'request',
        'request-all-params'
    ]
};
