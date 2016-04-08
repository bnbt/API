module.exports = function (sequelize, DataTypes) {
    var state_role = sequelize.define('state_role', {
        entity_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        role_id: {
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
                state_role.belongsTo(models.state, {foreignKey: 'state_id'});
                state_role.belongsTo(models.role, {foreignKey: 'role_id'});
            }
        },
        timestamps: true,
        tableName: 'state_role',
        freezeTableName: true
    });
    return state_role;
};
