/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('States', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    state_name: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'States',
    freezeTableName: true
  });
};
