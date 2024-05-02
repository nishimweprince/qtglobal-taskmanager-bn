'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      project_task.belongsTo(models.task, {
        foreignKey: 'task_id',
        as: 'task',
        onDelete: 'CASCADE',
      });
      project_task.belongsTo(models.project, {
        foreignKey: 'project_id',
        as: 'project',
        onDelete: 'CASCADE',
      });
    }
  }
  project_task.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'task',
        key: 'id'
      }
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'project',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'project_task',
  });
  return project_task;
};