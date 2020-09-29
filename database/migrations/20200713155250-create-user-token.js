'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_tokens', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER(10).UNSIGNED,
        },
        userId: {
            allowNull: false,
            type: Sequelize.INTEGER(10).UNSIGNED,
        },
        token: {
            allowNull: false,
            type: Sequelize.BLOB,
        },
        email: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        type: {
            allowNull: false,
            type: Sequelize.ENUM('reset_password', 'active_user', 'refresh_token'),
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_tokens');
  }
};