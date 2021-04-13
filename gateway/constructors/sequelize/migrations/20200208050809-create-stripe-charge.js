'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StripeCharges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orderId: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM({
          values: [
            'new',
            'pending',
            'succeeded',
            'failed',
          ],
        }),
        defaultValue: 'new',
      },
      chargeRef: {
        type: Sequelize.STRING,
        allowNull: true,
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
    return queryInterface.dropTable('StripeCharges', { schema: 'gateway' })
  },
}
