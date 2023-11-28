'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tasks', 'description', {
      type: Sequelize.STRING(300),
      allowNull: true,
      validate: {
        len: [0, 300]
      }
    });

    await queryInterface.addColumn('projects', 'description', {
      type: Sequelize.STRING(300),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
