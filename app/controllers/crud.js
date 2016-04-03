module.exports = function (mycro) {
    var socket = mycro.services['socket'],
        populateModelFromRequest = function (req) {
            var modelName = req.options.model,
                Model = req.mycro.models[modelName];
            if (!Model) return res.json(400, {error: 'Invalid model specified: ' + modelName});
            return Model
        };
    return {
        create: function (req, res) {
            var model = populateModelFromRequest(req);
            req.mycro.services['data'].create(model, req.body, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
                socket.emit('create', {type: req.options.model, records: records});
            });
        },
        destroy: function (req, res) {
            var model = populateModelFromRequest(req);
            req.mycro.services['data'].remove(model, req.params.id, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
                socket.emit('destroy', {type: req.options.model, records: records});
            });
        },
        find: function (req, res) {
            var model = populateModelFromRequest(req);
            req.mycro.services['data'].find(model, req.query, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
            });
        },
        findOne: function (req, res) {
            var model = populateModelFromRequest(req);
            req.mycro.services['data'].detail(model, req.params.id, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
            });
        },
        update: function (req, res) {
            var model = populateModelFromRequest(req);
            req.mycro.services['data'].update(model, req.params.id, JSON.parse(req.body), function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
                socket.emit('update', {type: req.options.model, records: records});
            });
        }
    }
};