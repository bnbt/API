/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var device = sequelize.define('device', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false
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
        model: 'state',
        key: 'entity_id'
      }
    },
    requires_rfid: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        device.hasMany(models.device_state, {foreignKey: 'device_id'});
        device.belongsTo(models.state, {foreignKey: 'current_state'});
      }
    },
    timestamps: true,
    tableName: 'device',
    freezeTableName: true
  });
  return device;
};
