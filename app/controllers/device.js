'use strict';
var util = require('util');
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
                data.findPromise(models['device'], {where: {device_id: deviceId}}),
                data.findPromise(models['user'], {where: {rfid: rfidCode}})
            ];
            Promise.all(promises)
                .then(function (values) {
                    device = values[0];
                    user = values[1];
                    if (!device) {
                        res.status(500);
                        return res.end();
                    }
                    deviceState = device.deviceStates[stateNumber];
                    if (deviceState === undefined) {
                        res.status(404);
                        return res.end();
                    }
                    device.setCurrentState(deviceState.entity_id);
                    var audit = new models['audit'];
                    audit.setRequestDate(new Date());
                    user && audit.setUser(user);
                    audit.setDevice(device);
                    audit.setState(deviceState);
                    audit.setRfid(rfidCode);
                    return Promise.all([
                        audit.save(),
                        device.save()
                    ]);
                })
                .then(function () {
                    res.status(200);
                    res.end();
                })
                .catch(function (error) {
                    return res.json(500, error);
                });
        },

        getState: function (req, res) {

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
