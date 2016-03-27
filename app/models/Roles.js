/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Roles', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Roles',
    freezeTableName: true
  });
};
