/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DeviceStates', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    device_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'Devices',
        key: 'entity_id'
      }
    },
    state_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'States',
        key: 'entity_id'
      }
    }
  }, {
    tableName: 'DeviceStates',
    freezeTableName: true
  });
};
