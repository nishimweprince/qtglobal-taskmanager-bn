'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task_assignee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      task_assignee.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  task_assignee.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'task',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'task_assignee',
  });
  return task_assignee;
};