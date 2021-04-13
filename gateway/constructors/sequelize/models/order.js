const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Orders extends Model {
    static isNewFormat() { return true }
    static init(sequelize, DataTypes) {
      return super.init({
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        productId: DataTypes.INTEGER,
        giftId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        amount: DataTypes.STRING,
        currency: DataTypes.STRING,
        status: DataTypes.ENUM({
          values: [
            'new',
            'created',
            'canceled',
            'failed',
            'succeeded',
          ],
        }),
      }, {
        sequelize,
        modelName: 'Orders',
        schema: 'gateway',
      })
    }

    static associate(models) {
      this.user = this.belongsTo(models.Users, {
        as: 'user',
        foreignKey: 'userId',
      })

      this.product = this.belongsTo(models.Products, {
        as: 'product',
        foreignKey: 'productId',
      })
    }

    async complete() {
      this.status = 'completed'
      return this.save()
    }

  }

  return Orders
}
