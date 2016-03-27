/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audit', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    request_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'entity_id'
      }
    },
    device_id: {
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
    timestamps: true,
    tableName: 'audit',
    freezeTableName: true
  });
};
