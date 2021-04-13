'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        {
          tableName: 'StripeCharges',
          schema: 'gateway',
        },
        'stripePaymentIntentId',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        {
          tableName: 'StripeCharges',
          schema: 'gateway',
        },
        'stripePaymentIntentId'
      ),
    ])
  },
}
