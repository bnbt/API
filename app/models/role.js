/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('role', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        role.hasMany(models.user, {foreignKey: 'role_id'})
      }
    },
    timestamps: true,
    tableName: 'role',
    freezeTableName: true
  });
};
