/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('state', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    state_name: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'state',
    freezeTableName: true
  });
};
