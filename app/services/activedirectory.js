var ActiveDirectory = require('activedirectory'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    params = yaml.safeLoad(fs.readFileSync('config/parameters.yml', 'utf8')),
    ad = new ActiveDirectory(params['ad']);

module.exports = function (mycro) {
    var findUser = function (user, callback) {
            // findUsers(function (users) {
            //     var user = null;
            //     users.some(function (adUser) {
            //         if (user.sAMAccountName.toLowerCase() === user.toLowerCase()) {
            //             return user = adUser;
            //         }
            //     });
            //     if (!user) {
            //         callback('User ' + user + 'not found');
            //     }
            //     else {
            //         callback(null, user);
            //     }
            // });
            ad.findUser(user, callback);
        },
        findUsers = function (callback) {
            // fs.readFile('users.json', 'utf8', function (err, data) {
            //     callback(err, JSON.parse(data));
            // });
            ad.findUsers('CN=*', true, callback);
        },
        authenticate = function (user, password, callback) {
            // return true;
            findUser(user, function (err, user) {
                if (err) {
                    return callback(err, null);
                }
                // callback(null, true);
                ad.authenticate(user.userPrincipalName, password, callback);
            })
        };

    return {
        findUsers: findUsers,
        findUser: findUser,
        authenticate: authenticate
    }
};
