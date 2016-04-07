/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var device_state = sequelize.define('device_state', {
        entity_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        device_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'device',
                key: 'entity_id'
            }
        },
        state_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'state',
                key: 'entity_id'
            }
        },
        order: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
        }
    }, {
        classMethods: {
            associate: function (models) {
                device_state.belongsTo(models.state, {foreignKey: 'state_id'});
                device_state.belongsTo(models.device, {foreignKey: 'device_id'});
            }
        },
        timestamps: true,
        tableName: 'device_state',
        freezeTableName: true
    });
    return device_state;
};
