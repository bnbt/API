module.exports = function(mycro) {
    var socket = mycro.services['socket'];
    
    return {
        'findAll': function(req, res) {
            req.mycro.models['Devices'].findAll().then(function(result) {
                res.send(result);
                socket.emit('test', 'this is a test');
            });
        },
        'findOne': function(req, res) {
            res.send("One Device");
        }
    }
};
