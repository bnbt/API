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
};
