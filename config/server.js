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
        'request-all-params',
        function response(mycro) {
            return function response(req, res, next) {
                res.removeHeader('Content-Length');
                res.removeHeader('Content-Type');
                res.removeHeader('Connection');
                res.removeHeader('Date');
                res.removeHeader('Transfer-Encoding');
                next();
            }
        }
    ]
};
