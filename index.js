'use strict';

var mycro = require('./app');
mycro.start(function(err) {
    if (err) {
        mycro.log('error', 'there was an error starting bnb:', err);
    } else {
        mycro.log('info', 'bnb started successfully');
    }
});
