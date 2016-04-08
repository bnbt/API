/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        entity_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_AD: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rfid: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        role_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'role',
                key: 'entity_id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                user.belongsTo(models.role, {foreignKey: 'role_id'});
                user.hasMany(models.audit, {foreignKey: 'user_id'});
            },
            include: function () {
                return ['role'];
            }
        },
        timestamps: true,
        tableName: 'user',
        freezeTableName: true
    });

    return user;
};
