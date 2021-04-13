const { Sequelize, Model } = require('sequelize')
const stripe = require('^/constructors/stripe')
// const plaid = require('^/constructors/plaid')
// const globalplaid = require('plaid')

'use strict'
module.exports = (sequelize, DataTypes) => {

  class StripeCharges extends Model {
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
        stripePaymentIntentId: DataTypes.INTEGER,
        status: DataTypes.ENUM({
          values: [
            'pending',
            'succeeded',
            'failed',
          ],
        }),
        chargeRef: DataTypes.STRING,
      }, {
        sequelize,
        modelName: 'StripeCharges',
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

    static async create({
      orderId,
      userId,
      ...attrs
    }) {
      console.log('args', orderId, userId, attrs)
      const order = await sequelize.models.Orders.findOne({ where: { id: orderId } })
      const stripePaymentIntent = await sequelize.models.StripePaymentIntents.findOne({ where: { orderId } })
      const customer = await sequelize.models.StripeCustomers.findOne({ where: { userId } })
      console.log('order', order)
      console.log('customer', customer)
      console.log('stripePaymentIntent', stripePaymentIntent)
      const charge = await stripe.charges.create({
        amount: order.amount, // this is written in cents
        currency: order.currency,
        description: stripePaymentIntent.description,
        customer: customer.customerRef,
      })

      console.log('charge', charge)

      const chargeObject = await super.create({
        orderId,
        userId,
        stripePaymentIntentId: stripePaymentIntent.id,
        chargeRef: charge.id,
        status: 'pending',
        ...attrs,
      })

      const transaction = await sequelize.models.UserTransactions.create({
        userId,
        productId: order.productId,
        amount: parseInt(order.amount),
        decimals: 2, // TODO
        currency: 'USD', // TODO
        paymentId: chargeObject.id,
        paymentProviderId: 1, // TODO
        status: 'pending',
        type: 'ach_deposit',
        chargeId: chargeObject.id,
        orderId,
        ...attrs,
      })

      return chargeObject
    }

    static async webhookUpdate(values, query, ...args) {
      const instance = await this.findOne(query, ...args)
      const updated = await instance.update(values)
      console.log('updated', updated)
      // const holding = await sequelize.models.UserInvestmentHoldings.findOne({
      //   where: {
      //     paymentId: updated.id,
      //   },
      // })
      const transaction = await sequelize.models.UserTransactions.findOne({
        where: {
          chargeId: updated.id,
        },
      })
      console.log('transaction', transaction)
      if (updated.status === 'succeeded') {
        await transaction.update({
          status: updated.status,
        })
      }

      return updated
    }
  }

  return StripeCharges
}
