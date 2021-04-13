const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class PaymentSources extends Model {
    static isNewFormat() { return true }
    static init(sequelize, DataTypes) {
      return super.init({
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        userId: DataTypes.INTEGER,
        providerId: DataTypes.INTEGER,
        type: DataTypes.ENUM({
          values: ['credit', 'debit'],
        }),
        isDefault: DataTypes.BOOLEAN,
      }, {
        sequelize,
        modelName: 'PaymentSources',
        schema: 'gateway',
      })
    }

    static associate(models) {
      this.provider = this.belongsTo(models.PaymentProviders, {
        as: 'provider',
        foreignKey: 'providerId',
      })

      this.user = this.belongsTo(models.Users, {
        as: 'user',
        foreignKey: 'userId',
      })
    }

  }

  return PaymentSources
}
