const { Sequelize, Model } = require('sequelize')
const stripe = require('^/constructors/stripe')
const plaid = require('^/constructors/plaid')
// const Plaid = require('plaid')

'use strict'
module.exports = (sequelize, DataTypes) => {

  class StripeCustomers extends Model {
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
        customerRef: DataTypes.STRING,
        stripeDefaultSourceRef: DataTypes.STRING,
      }, {
        sequelize,
        modelName: 'StripeCustomers',
        schema: 'gateway',
      })
    }

    static associate(models) {
      this.user = this.belongsTo(models.Users, {
        as: 'user',
        foreignKey: 'userId',
      })
    }

    static toStripeCustomerValues(values) {
      const newValues = {}
      if (values.stripeDefaultSourceRef) newValues.default_source = values.stripeDefaultSourceRef
      return newValues
    }

    async update(values, ...rest) {
      const stripeCustomer = await stripe.customers.update(this.customerRef, StripeCustomers.toStripeCustomerValues(values))
      return super.update(values)
    }

    static async findOneOrCreateOne(query, { plaidToken, account, userId, ...rest }) {
      let stripeCustomer = await this.findOne(query)

      if (!stripeCustomer) {
        const privateToken = await plaid.exchangePublicToken(plaidToken)
        const stripeToken = await plaid.createStripeToken(privateToken.access_token, account)
        const customer = await stripe.customers.create({
          source: stripeToken.stripe_bank_account_token,
        })

        stripeCustomer = await this.create({
          userId,
          customerRef: customer.id,
          stripeDefaultSourceRef: customer.default_source,
        })
      }

      return stripeCustomer
    }

  }

  return StripeCustomers
}
