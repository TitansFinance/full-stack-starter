'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        {
          tableName: 'StripeCustomers',
          schema: 'gateway',
        },
        'stripeDefaultSourceRef',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        {
          tableName: 'StripeCustomers',
          schema: 'gateway',
        },
        'stripeDefaultSourceRef'
      ),
    ])
  },
}
