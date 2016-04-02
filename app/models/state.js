/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var state = sequelize.define('state', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    state_name: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    red: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    green: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    blue: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        state.hasMany(models.device_state, {foreignKey: 'state_id'});
        state.hasOne(models.device, {foreignKey: 'current_state'});
        state.hasMany(models.audit, {foreignKey: 'state_id'});
      }
    },
    timestamps: true,
    tableName: 'state',
    freezeTableName: true
  });
  return state;
};
