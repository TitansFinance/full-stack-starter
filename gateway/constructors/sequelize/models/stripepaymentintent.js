const { Model } = require('sequelize')
const stripe = require('^/constructors/stripe')
// const plaid = require('^/constructors/plaid')

module.exports = (sequelize, DataTypes) => {

  class StripePaymentIntents extends Model {
    static isNewFormat() { return true }
    static init(sequelize, DataTypes) {
      return super.init({
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        orderId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        paymentIntentRef: DataTypes.STRING,
        clientSecret: DataTypes.STRING,
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
        modelName: 'StripePaymentIntents',
        schema: 'gateway',
      })
    }

    static associate(models) {
      this.user = this.belongsTo(models.Users, {
        as: 'user',
        foreignKey: 'userId',
      })

      this.order = this.belongsTo(models.Orders, {
        as: 'order',
        foreignKey: 'orderId',
      })
    }

    static async create({ amount, currency, productId, userId, ...rest }) {
      const transaction = await sequelize.transaction()
      try {
        const order = await sequelize.models.Orders.create({
          amount,
          currency,
          userId,
          productId,
          status: 'new',
        }, { transaction })

        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          description: JSON.stringify({
            amount,
            currency,
            timestamp: Date.now(),
          }),
          setup_future_usage: rest.setup_future_usage || 'off_session',
          ...rest,
        })

        console.log('paymentIntent: ', paymentIntent)

        const stripePaymentIntent = await super.create({
          amount,
          currency,
          paymentIntentRef: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          description: paymentIntent.description,
          userId,
          orderId: order.id,
          status: 'new',
        }, { transaction })
        await transaction.commit()
        return stripePaymentIntent
      } catch (error) {
        console.error(error)
        await transaction.rollback()
        return null
      }
    }
  }

  return StripePaymentIntents
}
