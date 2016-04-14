var ActiveDirectory = require('activedirectory'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    params = yaml.safeLoad(fs.readFileSync('config/parameters.yml', 'utf8')),
    atob = require('atob'),
    ad = new ActiveDirectory({
        url: params['ad']['url'],
        username: params['ad']['username'],
        password: atob(params['ad']['password']),
        baseDN: params['ad']['baseDN']
    });

module.exports = function (mycro) {
    var findUser = function (user, callback) {
            ad.findUser(user, callback);
        },
        findUsers = function (callback) {
            ad.findUsers('CN=*', true, callback);
        },
        authenticate = function (username, password, callback) {
            findUser(username, function (err, user) {
                if (err) {
                    return callback(err, null);
                }
                var cb = function (err, auth) {
                    if (auth) {
                        callback(null, user);
                    } else {
                        callback(err, null)
                    }
                };
                if (user) {
                    ad.authenticate(user.userPrincipalName, password, cb);
                } else {
                    return callback('Incorrect credentials', null);
                }
            })
        };

    return {
        findUsers: findUsers,
        findUser: findUser,
        authenticate: authenticate
    }
};
