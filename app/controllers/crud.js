module.exports = function (mycro) {
    var socket = mycro.services['socket'],
        populateModelFromRequest = function (req, res) {
            var modelName = req.options.model,
                Model = req.mycro.models[modelName];
            if (!Model) return res.json(400, {error: 'Invalid model specified: ' + modelName});
            return Model
        };
    return {
        create: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].create(model, req.body, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                socket.emit('change', {type: req.options.model, action: 'create', records: records});
                res.json(200, records);
            });
        },
        destroy: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].remove(model, req.params.id, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                socket.emit('change', {type: req.options.model, action: 'delete', records: records});
                res.json(200, records);
            });
        },
        find: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].find(model, {}, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
            }, req.query.l * 1, req.query.p * req.query.l);
        },
        findOne: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].detail(model, req.context.id, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, records);
            });
        },
        update: function (req, res) {
            var model = populateModelFromRequest(req, res);
            req.mycro.services['data'].update(model, req.params.id, req.body, function(err, records) {
                if (err) {
                    return res.json(500, {error: err});
                }
                socket.emit('change', {type: req.options.model, action: 'update', records: records});
                res.json(200, records);
            });
        }
    }
};
