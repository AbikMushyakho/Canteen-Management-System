"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    //lastly undo done
    // await queryInterface.addColumn("users", "gender", {
    //   type: Sequelize.ENUM("Male", "Female")
    // })
  },

  async down(queryInterface, Sequelize) {
    // last done
    await queryInterface.addColumn("users", "verified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })

  },
};
