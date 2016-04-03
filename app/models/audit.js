/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var audit = sequelize.define('audit', {
        entity_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        request_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'user',
                key: 'entity_id'
            }
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
        }
    }, {
        classMethods: {
            associate: function (models) {
                audit.belongsTo(models.user, {foreignKey: 'user_id'});
                audit.belongsTo(models.device, {foreignKey: 'device_id'});
                audit.belongsTo(models.state, {foreignKey: 'state_id'});
            },
            include: function() {
                return ['user', 'device', 'state'];
            }
        },
        timestamps: true,
        tableName: 'audit',
        freezeTableName: true
    });
    return audit;
};
