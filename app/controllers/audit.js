'use strict';
var util = require('util');
module.exports = function (mycro) {
    var populateModelFromRequest = function (req, res) {
        var modelName = req.options.model,
            Model = req.mycro.models[modelName];
        if (!Model) return res.json(400, {error: 'Invalid model specified: ' + modelName});
        return Model
    };
    return {
        paginateAudit: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].paginateAudit(model, req.params.id, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
            });
        },
        rfidList: function(req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].rfidList(model, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
            });
        }
    }
};
