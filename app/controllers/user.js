'use strict';
var util = require('util'),
    crypto = require('crypto'),
    fs = require('fs');

function sha1(msg) {
    var hash = crypto.createHash('sha1');
    hash.update(msg);
    return hash.digest('hex');
}

module.exports = function (mycro) {
    var socket = mycro.services['socket'],
        dataService = mycro.services['data'],
        userService = mycro.services['activedirectory'];
    return {
        getADUsers: function (req, res) {
            userService.findUsers(function (err, data) {
                res.json(200, data);
            });
        },
        logout: function (req, res) {
            mycro.models['user'].findOne({
                where: {token: req.headers['x-token']}
            }).then(function (data) {
                if (data) {
                    data.update({token: null}).then(function (user) {
                        res.json(200, {message: 'Logout successful!'});
                    });
                } else {
                    res.json(404, {error: 'User to logout not found'});
                }
            }).catch(function (err) {
                res.json(400, {error: err});
            });
        },

        login: function (req, res) {
            var username = req.body.username,
                password = req.body.password;
            userService.authenticate(username, password, function (err, auth) {
                if (!auth || err) {
                    return res.json(403, {error: "Incorrect credentials"});
                }
                // authentication successful
                var token = sha1(username + new Date().getTime()),
                    models = mycro.models,
                    user = null;
                models['user'].findOne({
                        where: {user_AD: username},
                        include: [models['role']]
                    })
                    .then(function (data) {
                        if (data) {
                            user = data;
                            return user.update({token: token})
                        } else {
                            models['user'].create({user_AD: username, token: token});
                        }
                    })
                    .then(function(data) {
                        if(data instanceof models['user'].Instance) {
                            user = data;
                        }
                        let role = user ? user.role ? user.role.name : null : null;
                        res.json(200, {token: token, role: role, name: auth.displayName });
                    })
                    .catch(function (err) {
                        res.json(401, err);
                    });
            });
        }
    }
};
