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
                where: {token: req.body.token}
            }).then(function (data) {
                if (data) {
                    data.update({token: null}).then(function (user) {
                        res.json(200, {msg: 'Logout successful!'});
                    });
                } else {
                    res.json(400, {error: 'User to logout not found'});
                }
            }).catch(function (err) {
                res.json(400, {error: err});
            });
        },
        login: function (req, res) {
            // TODO: MOVE CHECK TO VALIDATION
            if (req.body.hasOwnProperty("user") && req.body.hasOwnProperty('passkey') && dataService.validateUser(req.body.user, req.body.passkey)) {
                var token = sha1("123" + req.body.user + new Date().getTime());
                res.json(200, {token: token});
                mycro.models['user'].findOne({
                        where: {user_AD: req.body.user},
                        include: [mycro.models['role']]
                    })
                    .then(function (data) {
                        if (data) {
                            data.update({token: token}).then(function () {});
                        } else {
                            console.log(data);
                            mycro.models['user'].create({user_AD: req.body.user, token: token});
                        }
                    })
                    .catch(function (err) {
                        res.json(401, JSON.parse(err));
                    });
            } else {
                res.json(401);
            }
        }
    }
};
