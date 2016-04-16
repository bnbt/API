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
                    res.end(util.format("~%d,%d,%s~", currentState, stateColors.length, stateColors.join(',')));
                    device.set('last_heartbeat', new Date());
                    device.set('active', true);
                    device.save();
                }
            );
        },

        putState: function (req, res) {
            var deviceId = req.header('device'),
                stateNumber = req.query.s,
                rfidCode = req.query.u,
                device = null,
                user = null,
                deviceState = null,
                accepted = false;
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
                        res.end();
                        return Promise.reject();
                    }
                    deviceState = device.deviceStates[stateNumber];
                    if (deviceState === undefined) {
                        res.status(404);
                        res.end();
                        return Promise.reject();
                    }
                    if (!user) {
                        return Promise.resolve(null);
                    }
                    return deviceState.reload({include: data.getIncludes(models.state)});
                })
                .then(function (reloadedState) {
                    if (!reloadedState) {
                        return Promise.resolve();
                    }
                    deviceState = reloadedState;
                    if (!deviceState.stateRoles.length) {
                        return Promise.resolve();
                    }
                    var stateAllowedRole = false;
                    deviceState.stateRoles.some(function(role) {
                        if (role.entity_id === user.role.entity_id) {
                            return stateAllowedRole = true;
                        }
                    });
                    if (! stateAllowedRole) {
                        res.status(403);
                        res.end();
                        return Promise.reject();
                    }
                    return Promise.resolve();
                })
                .then(function () {
                    device.set('current_state', deviceState.entity_id);
                    device.set('last_request_date', new Date());
                    device.set('last_heartbeat', new Date());
                    if(user) {
                        device.set('last_request_user', user.entity_id)
                    }
                    return device.save();
                })
                .then(function () {
                    socket.emit('change', {type: 'device', action: 'update', records: device});
                    if(!user || (user && !user.user_AD)) {
                        let response = 'Unknown user';
                        res.status(200);
                        res.end(util.format("~%s~", response));
                        accepted = true;
                        return Promise.resolve();
                    }
                    req.mycro.services['activedirectory'].findUser(user.user_AD, function(err, adUser) {
                        let response = !err && adUser ? mycro.services['helper'].removeDiacritics(adUser.givenName.split(' ')[0].split('-')[0]) : "Unknown user";
                        res.status(200);
                        res.end(util.format("~%s~", response.substring(0, 16)));
                        accepted = true;
                        return Promise.resolve();
                    });
                })
                .catch(function (error) {
                    return res.json(500, error);
                })
                .finally(function() {
                    let auditAttributes = {
                        request_date: new Date(),
                        device_id: device.entity_id,
                        state_id: deviceState.entity_id,
                        user_id: user ? user.entity_id : null,
                        rfid: rfidCode,
                        accepted: accepted
                    };
                    return models['audit'].create(auditAttributes);
                })
                .then(function(data) {
                    socket.emit('change', {type: 'audit', action: 'create', records: data});
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
                        if (state.entity_id === device.state.entity_id) {
                            res.status(200);
                            return res.end(util.format("~%d~", state.device_state.sort_order))
                        }
                    });
                    device.set('last_heartbeat', new Date());
                    device.set('active', true);
                    device.save();
                }
            );
        },

        create: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].createDevice(model, req.body, function (err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                socket.emit('change', {type: req.options.model, action: 'create', records: records});
                res.json(200, records);
            });
        },

        update: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].updateDevice(model, req.params.id, req.body, function (err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                socket.emit('change', {type: req.options.model, action: 'update', records: records});
                res.json(200, records);
            });
        }
    }
};
