module.exports = function (sequelize, DataTypes) {
    var device = sequelize.define('device', {
        entity_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        device_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        active: {
            type: DataTypes.INTEGER(4),
            allowNull: true
        },
        last_request_user: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'user',
                key: 'entity_id'
            }
        },
        last_request_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        current_state: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'state',
                key: 'entity_id'
            }
        },
        requires_rfid: {
            type: DataTypes.INTEGER(4),
            allowNull: true
        },
        last_heartbeat: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                device.belongsToMany(models.state, {
                    through: {model: models.device_state},
                    foreignKey: 'device_id',
                    as: {singular: 'deviceState', plural: 'deviceStates'}
                });
                device.belongsTo(models.state, {foreignKey: 'current_state'});
                device.belongsTo(models.user, {as: 'lastUser', foreignKey: 'last_request_user'});
            },
            include: function () {
                return [
                    {model: 'state', alias: 'state'},
                    {model: 'state', alias: 'deviceStates'},
                    {model: 'user', alias: 'lastUser'}
                ]
            },
            order: function (models) {
                return '`device`.`entity_id` DESC, ' +
                    '`deviceStates.device_state`.`sort_order` ASC';
            }
        },
        timestamps: true,
        tableName: 'device',
        freezeTableName: true
    });
    return device;
};
