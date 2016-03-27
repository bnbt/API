module.exports = function (mycro) {
    var socket = mycro.services['socket'],
        populateModelFromRequest = function (req) {
            var modelName = req.options.model,
                Model = req.mycro.models[modelName];
            if (!Model) return res.json(400, {error: 'Invalid model specified: ' + modelName});
            return Model
        };
    return {
        create: function (req, res) { /* ... */
        },
        destroy: function (req, res) { /* ... */
        },
        find: function (req, res) {
            var Model = populateModelFromRequest(req),
                criteria = req.mycro.services['crud'].parseCriteriaFromRequest(req);
            Model.find(criteria, function (err, results) {
                if (err) return res.json(500, {error: err});
                res.json(200, {data: results});
            });
        },
        findOne: function (req, res) { /* ... */
        },
        update: function (req, res) { /* ... */
        }
    }
};