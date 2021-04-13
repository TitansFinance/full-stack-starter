'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM({
          values: ['currency', 'investment'],
        }),
      },
      currency: {
        type: Sequelize.ENUM({
          values: [
            'TTNS',
            'REP',
            'USDC',
            'DAI',
            'BAT',
            'ZRX',
            'WBTC',
            'SAI',
            'USDT',
            'ETH',
            'BTC',
            'CAD',
            'HKD',
            'CNY',
            'ISK',
            'PHP',
            'DKK',
            'HUF',
            'CZK',
            'GBP',
            'RON',
            'SEK',
            'IDR',
            'INR',
            'BRL',
            'RUB',
            'HRK',
            'JPY',
            'THB',
            'CHF',
            'EUR',
            'MYR',
            'BGN',
            'TRY',
            'NOK',
            'NZD',
            'ZAR',
            'USD',
            'MXN',
            'SGD',
            'AUD',
            'ILS',
            'KRW',
            'PLN',
          ],
        }),
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
    return queryInterface.dropTable('Products', { schema: 'gateway' })
  },
}
