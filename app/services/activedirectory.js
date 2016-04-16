var ActiveDirectory = require('activedirectory'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    params = yaml.safeLoad(fs.readFileSync('config/parameters.yml', 'utf8')),
    atob = require('atob'),
    Promise = require('bluebird'),
    ad = new ActiveDirectory({
        url: params['ad']['url'],
        username: params['ad']['username'],
        password: atob(params['ad']['password']),
        baseDN: params['ad']['baseDN']
    });

module.exports = function (mycro) {
    ad.findUsersAsync = Promise.promisify(ad.findUsers);
    var findUser = function (user, callback) {
            ad.findUser(user, callback);
        },
        findUsers = function (callback) {
            var promises = [
                ad.findUsersAsync({baseDN: 'OU=Users,OU=Production,DC=netrom,DC=local'}, false),
                ad.findUsersAsync({baseDN: 'OU=Users,OU=Administrative,DC=netrom,DC=local'}, false),
                ad.findUsersAsync({baseDN: 'OU=Users,OU=Auxiliary personnel,DC=netrom,DC=local'}, false)
            ];

            Promise.all(promises).spread(function (prodUsers, admUsers, auxUsers) {
                callback(null, prodUsers.concat(admUsers, auxUsers));
            }).catch(callback);
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
