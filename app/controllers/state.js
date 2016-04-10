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
        create: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].createState(model, req.body, function (err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
            });
        },

        update: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].updateState(model, req.params.id, req.body, function (err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
            });
        }
    }
};
