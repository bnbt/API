module.exports = function (sequelize, DataTypes) {
    var state = sequelize.define('state', {
        entity_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        state_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        red: {
            type: DataTypes.INTEGER(3),
            allowNull: true
        },
        green: {
            type: DataTypes.INTEGER(3),
            allowNull: true
        },
        blue: {
            type: DataTypes.INTEGER(3),
            allowNull: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                state.belongsToMany(models.device, {
                    through: {model: models.device_state},
                    foreignKey: 'state_id',
                    as: {singular: 'stateDevice', plural: 'stateDevices'}
                });
                state.belongsToMany(models.role, {
                    through: {model: models.state_role},
                    foreignKey: 'state_id',
                    as: {singular: 'stateRole', plural: 'stateRoles'}
                });
                state.hasMany(models.device, {foreignKey: 'current_state'});
                state.hasMany(models.audit, {foreignKey: 'state_id'});
            },
            include: function () {
                return [{model: 'role', alias: 'stateRoles'}]
            }
        },
        timestamps: true,
        tableName: 'state',
        freezeTableName: true
    });
    return state;
};
