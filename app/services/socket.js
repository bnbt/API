var socketio = require('socket.io');

module.exports = function(mycro) {
    var io = socketio.listen(mycro.server.server),
        currentSocket = null;
    io.sockets.on('connection', function(socket) {
        currentSocket = socket;
    });
    return {
        io: io,
        emit: function(event, data) {
            currentSocket && currentSocket.emit(event, data);
        }
    }
};