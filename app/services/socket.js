var socketio = require('socket.io');

module.exports = function(mycro) {
    // workaround, as described here: https://github.com/restify/node-restify/issues/717#issuecomment-66122016
    var io = socketio.listen(mycro.server.server),
        currentSocket = null;

    io.sockets.on('connection', function(socket) {
        currentSocket = socket;
    });

    return {
        io: io, // in case custom connection related code is needed
        emit: function(event, data) {
            currentSocket && currentSocket.emit(event, data);
        }
    }
};
