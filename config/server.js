'use strict';
var corsMiddleware = require('restify-cors-middleware'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    params = yaml.safeLoad(fs.readFileSync('config/parameters.yml', 'utf8'));

module.exports = {
    port: params['app']['port'],
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
