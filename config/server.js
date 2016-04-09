'use strict';
var corsMiddleware = require('restify-cors-middleware');
module.exports = {
    port: 8000,
    middleware: [
        'acceptParser',
        'dateParser',
        'queryParser',
        'bodyParser',
        function cors(mycro) {
            var cors = corsMiddleware({
                preflightMaxAge: 5,
                origins: ['*'],
                credentials: true // defaults to false
            });
            mycro.server.pre(cors.preflight);
            return cors.actual;
        },
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
