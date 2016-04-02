module.exports = function (mycro) {
    var socket = mycro.services['socket'];
    return {
        get: function (req, res) {
            req.mycro.services['data'].findWithCriteria(req.mycro.models['device'],
                {
                    where: {
                        device_id: req.header('device')
                    },
                    // include: [
                    //     {model: mycro.models['device_state']}
                    // ]
                }
                , function (err, records) {
                    if (err) {
                        res.status(500);
                    }
                    if (!records.length) {
                        res.status(404);
                    }
                    return res.json(200, records[0]);
                    return res.end();
                });
        }
    }
};