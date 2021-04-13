'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StripePaymentIntents', {
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
      paymentIntentRef: {
        type: Sequelize.STRING,
      },
      clientSecret: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM({
          values: [
            'new',
            'created',
            'canceled',
            'failed',
            'succeeded',
          ],
        }),
        defaultValue: 'new',
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
    return queryInterface.dropTable('StripePaymentIntents', { schema: 'gateway' })
  },
}
