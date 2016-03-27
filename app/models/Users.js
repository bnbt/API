/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_AD: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'entity_id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Users',
    freezeTableName: true
  });
};
