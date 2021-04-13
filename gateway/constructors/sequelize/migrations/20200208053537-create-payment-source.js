'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PaymentSources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      providerId: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM({
          values: ['credit', 'debit'],
        }),
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    },
    {
      schema: 'gateway',
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PaymentSources', { schema: 'gateway' })
  },
}
