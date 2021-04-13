const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class PaymentProviders extends Model {
    static isNewFormat() { return true }
    static init(sequelize, DataTypes) {
      return super.init({
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        slug: DataTypes.ENUM({
          values: [
            'stripe',
          ],
        }),
        supportedTypes: DataTypes.ARRAY(DataTypes.STRING),
      }, {
        sequelize,
        modelName: 'PaymentProviders',
        schema: 'gateway',
      })
    }

    static associate(models) {}

  }

  return PaymentProviders
}
