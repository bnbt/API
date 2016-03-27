module.exports = {
    'findAll': function(req, res) {
        req.mycro.models['Devices'].findAll().then(function(result) {
            res.send(result);
        });
    },
    'findOne': function(req, res) {
        res.send("One Device");
    }
};
