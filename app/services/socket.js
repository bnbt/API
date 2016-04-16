var socketio = require('socket.io');

module.exports = function(mycro) {
    // workaround, as described here: https://github.com/restify/node-restify/issues/717#issuecomment-66122016
    var io = socketio.listen(mycro.server.server);

    return {
        io: io, // in case custom connection related code is needed
        emit: function(event, data) {
            io.sockets.emit(event, data);
        }
    }
};
