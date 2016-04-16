var end = function () {
    process.exit();
}
namespace('bnb', function () {
    desc('Check for inactive devices');
    task('inactive', function () {
        var Mycro = require('mycro'),
            mycro = new Mycro({hooks: ['server', 'connections', 'models', 'services']}),
            fs = require('fs'),
            yaml = require('js-yaml'),
            params = yaml.safeLoad(fs.readFileSync('config/parameters.yml', 'utf8'));
        mycro.start(function (err) {
            var device = mycro.models['device'];
            device.update(
                {active: false},
                {
                    where: {
                        last_heartbeat: {
                            $or: [
                                {$lt: device.sequelize.fn('date_sub', device.sequelize.fn('NOW'), device.sequelize.literal('INTERVAL ' + params['max_heartbeat'] + ' MINUTE'))},
                                null
                            ]
                        }
                    }
                }
            ).spread(function (affectedCount, affectedRows) {
                console.log('Marked', affectedCount, 'devices as inactive');
                end();
            }).catch(function (err) {
                console.log(err);
                end();
            });
        });
    });
});