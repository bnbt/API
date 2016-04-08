'use strict';
var util = require('util'),
    Promise = require('bluebird');
module.exports = function (mycro) {
    var socket = mycro.services['socket'],
        data = mycro.services['data'],
        models = mycro.models,
        populateModelFromRequest = function (req, res) {
            var modelName = req.options.model,
                Model = req.mycro.models[modelName];
            if (!Model) return res.json(400, {error: 'Invalid model specified: ' + modelName});
            return Model
        };
    return {
        getConfig: function (req, res) {
            data.find(req.mycro.models['device'], {device_id: req.header('device')},
                function (err, records) {
                    if (err) {
                        res.status(500);
                        return res.end();
                    }
                    if (records && !records.length) {
                        res.status(404);
                        return res.end();
                    }
                    let device = records[0];
                    var currentState = null,
                        stateColors = [];
                    device.deviceStates.forEach(function (state, index) {
                        if (device.state.entity_id === state.entity_id) {
                            currentState = index;
                        }
                        stateColors[index] = [state.state_name, state.red, state.green, state.blue].join(',');
                    });
                    return res.end(util.format("~%d,%d,%s~", currentState, stateColors.length, stateColors.join(',')))
                }
            );
        },

        putState: function (req, res) {
            var deviceId = req.header('device'),
                stateNumber = req.query.s,
                rfidCode = req.query.u,
                device = null,
                user = null,
                deviceState = null;
            var promises = [
                data.findOnePromise(models['device'], {device_id: deviceId}),
                data.findOnePromise(models['user'], {rfid: rfidCode})
            ];
            Promise.all(promises)
                .then(function (values) {
                    device = values[0];
                    user = values[1];
                    if (device === undefined) {
                        res.status(500);
                        return res.end();
                    }
                    deviceState = device.deviceStates[stateNumber];
                    if (deviceState === undefined) {
                        res.status(404);
                        return res.end();
                    }
                    device.set('current_state', deviceState.entity_id);
                    let auditAttributes = {
                        request_date: new Date(),
                        device_id: device.entity_id,
                        state_id: deviceState.entity_id,
                        rfid: rfidCode,
                        user: user || null
                    };
                    return Promise.all([
                        models['audit'].create(auditAttributes),
                        device.save()
                    ]);
                })
                .then(function () {
                    socket.emit('change', {type: 'device', records: device});
                    let response = user ? user.name : 'Unknown user';
                    res.status(200);
                    res.end(util.format("~%s~", response));
                })
                .catch(function (error) {
                    return res.json(500, error);
                });
        },

        getState: function (req, res) {
            data.findOne(req.mycro.models['device'], {device_id: req.header('device')},
                function (err, device) {
                    if (err) {
                        res.status(500);
                        return res.end();
                    }
                    if (!device) {
                        res.status(404);
                        return res.end();
                    }
                    if (!device.current_state) {
                        res.status(404);
                        return res.end();
                    }

                    device.deviceStates.some(function (state) {
                        if(state.entity_id === device.state.entity_id) {
                            res.status(200);
                            return res.end(util.format("~%d~", state.device_state.sort_order))
                        }
                    });
                }
            );
        },

        create: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].createDevice(model, req.body, function (err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
                socket.emit('change', {type: req.options.model, records: records});
            });
        },

        update: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].updateDevice(model, req.params.id, req.body, function (err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
                socket.emit('change', {type: req.options.model, records: records});
            });
        }
    }
};
