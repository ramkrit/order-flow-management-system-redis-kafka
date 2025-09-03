'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: "Ramkrit",
        email: "rkrit851@gmail.com",
        phone_number: "9818322703",
        is_active: true,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: "rkrit851@gmail.com" }, {});
  }
};
