'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.task, {
        foreignKey: 'user_id',
        as: 'tasks'
      }),
      user.hasMany(models.project, {
        foreignKey: 'user_id',
        as: 'projects'
      }),
      user.belongsToMany(models.task, {
        as: 'assignees',
        through: 'task_assignees',
        foreignKey: 'user_id'
      })
    }
  }
  user.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  });
  return user;
};