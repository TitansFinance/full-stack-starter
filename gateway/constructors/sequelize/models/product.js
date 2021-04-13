const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Products extends Model {
    static isNewFormat() { return true }
    static init(sequelize, DataTypes) {
      return super.init({
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        investmentId: DataTypes.INTEGER,
        type: DataTypes.ENUM({
          values: ['currency', 'investment'],
        }),
        currency: DataTypes.ENUM({
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
      }, {
        sequelize,
        modelName: 'Products',
        schema: 'gateway',
      })
    }

  }

  return Products
}

