'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      task.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user'
      });
      task.belongsToMany(models.project, {
        as: 'projects',
        through: 'project_tasks',
        foreignKey: 'task_id'
      });
      task.hasMany(models.task_file, {
        foreignKey: 'task_id',
        as: 'files'
      })
      task.belongsToMany(models.user, {
        as: 'assignees',
        through: 'task_assignees',
        foreignKey: 'task_id'
      })
    }
  }
  task.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'ready'),
      allowNull: false,
      defaultValue: 'pending',
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: true,
      validate: {
        len: [0, 300]
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    draft: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high'),
      allowNull: false,
      defaultValue: 'low',
    }
  }, {
    sequelize,
    modelName: 'task',
    tableName: 'tasks',
  });
  return task;
};