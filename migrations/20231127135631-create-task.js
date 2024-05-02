'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [0, 300]
        }
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['pending', 'in_progress', 'ready'],
        defaultValue: 'pending',
      },
      draft: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      priority: {
        type: Sequelize.ENUM('low', 'normal', 'high'),
        allowNull: false,
        defaultValue: 'low',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};