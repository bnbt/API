/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Audit', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    request_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'Users',
        key: 'entity_id'
      }
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
    tableName: 'Audit',
    freezeTableName: true
  });
};
