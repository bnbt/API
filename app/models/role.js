module.exports = function (sequelize, DataTypes) {
    var role = sequelize.define('role', {
        entity_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        role_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                role.hasMany(models.user, {foreignKey: 'role_id'});
                role.belongsToMany(models.state, {
                    through: {model: models.state_role},
                    foreignKey: 'role_id',
                    as: {singular: 'roleState', plural: 'roleStates'}
                });
            }
        },
        timestamps: true,
        tableName: 'role',
        freezeTableName: true
    });
    return role;
};
