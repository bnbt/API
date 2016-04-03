'use strict';
var util = require('util');
module.exports = function (mycro) {
    var socket = mycro.services['socket'],
        data = mycro.services['data'];
    return {
        getConfig: function (req, res) {
            data.find(req.mycro.models['device'], {device_id: req.header('device')},
                function (err, records) {
                    if (err) {
                        res.status(500);
                        return res.end()
                    }
                    if (records && !records.length) {
                        res.status(404);
                        return res.end();
                    }
                    let device = records[0];
                    var currentState = null,
                        stateColors = [];
                    device.device_states.forEach(function (state, index) {
                        if (device.state.entity_id === state.entity_id) {
                            currentState = index;
                        }
                        stateColors[index] = [state.state_name, state.red, state.green, state.blue].join(',');
                    });
                    // return res.json(200, device);
                    return res.end(util.format("~%d,%s~", currentState, stateColors.join(',')))
                });
        },
        putState: function (req, res) {
            data.find(mycro.models['user']);
            res.json(200, [req.query, req.header('device')]);
        }
    }
};