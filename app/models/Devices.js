/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Devices', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    last_request_user: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    last_request_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    current_state: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'States',
        key: 'entity_id'
      }
    },
    requires_rfid: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'Devices',
    freezeTableName: true
  });
};
