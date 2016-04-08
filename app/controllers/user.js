'use strict';
var util = require('util'),
    fs = require('fs');
module.exports = function (mycro) {
    var socket = mycro.services['socket'],
        data = mycro.services['data'];
    return {
        getADUsers: function (req, res) {
            fs.readFile('users.json', 'utf8', function(err, data) {
                res.json(200, JSON.parse(data));
            });
        }
    }
};
