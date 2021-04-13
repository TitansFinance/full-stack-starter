'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        {
          tableName: 'Orders',
          schema: 'gateway',
        },
        'amount',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '0',
        }
      ),
      queryInterface.addColumn(
        {
          tableName: 'Orders',
          schema: 'gateway',
        },
        'currency',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'USD',
        }
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        {
          tableName: 'Orders',
          schema: 'gateway',
        },
        'amount'
      ),
      queryInterface.removeColumn(
        {
          tableName: 'Orders',
          schema: 'gateway',
        },
        'currency'
      ),
    ])
  },
}
