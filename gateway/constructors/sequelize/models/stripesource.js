const { Model } = require('sequelize')
// https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/
const { Op } = require('sequelize')
const stripe = require('^/constructors/stripe')
// const plaid = require('^/constructors/plaid')
// const Plaid = require('plaid')

'use strict'
module.exports = (sequelize, DataTypes) => {

  class StripeSources extends Model {
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
        sourceRef: DataTypes.STRING,
        isDefault: DataTypes.BOOLEAN,
        disabled: DataTypes.BOOLEAN,
        description: DataTypes.STRING,
        metadata: DataTypes.JSONB,
      }, {
        sequelize,
        modelName: 'StripeSources',
        schema: 'gateway',
      })
    }

    static associate(models) {
      this.user = this.belongsTo(models.Users, {
        as: 'user',
        foreignKey: 'userId',
      })
    }

    async setDefault() {
      if (this.isDefault) return await StripeSources.findAll({ where: { userId: this.userId } })
      const transaction = await sequelize.transaction()
      try {
        const stripeSources = await StripeSources.update(
          { isDefault: false },
          {
            where: {
              userId: this.userId,
            },
          }, { transaction })
        const stripeSource = await this.update({ isDefault: true }, { transaction })
        let customer = await sequelize.models.StripeCustomers.findOne({ where: { userId: this.userId } })
        customer = await customer.update({
          stripeDefaultSourceRef: this.sourceRef,
          default_source: this.sourceRef,
        }, {
          transaction,
        })
        await transaction.commit()
        return await StripeSources.findAll({ where: { userId: this.userId } })
      } catch (error) {
        console.error(`errors.${__filename}`, error)
        await transaction.rollback()
        return false
      }
    }

    static async create(...args) {
      const [{ userId, ...input }, options] = args
      const transaction = await sequelize.transaction()
      try {
        const stripeCustomer = await sequelize.models.StripeCustomers.findOneOrCreateOne({
          where: { userId },
        }, {
          userId,
          ...input,
        })

        await StripeSources.update({
          isDefault: false,
        }, {
          where: {
            userId,
          },
        })

        const created = await super.create({
          userId,
          ...input,
          sourceRef: stripeCustomer.stripeDefaultSourceRef,
          isDefault: true,
        }, { transaction, ...options })
        await transaction.commit()
        return created
      } catch (e) {
        console.error(e)
        await transaction.rollback()
        return null
      }
    }

    static async createWithPaymentIntent(input, user) {
      try {
        const stripePaymentIntent = await sequelize.models.StripePaymentIntents.findOne({
          where: { userId: user.id },
        })

        const order = await sequelize.models.Orders.findOne({
          where: {
            userId: user.id,
            id: stripePaymentIntent.orderId,
          },
        })

        if (!stripePaymentIntent) throw new Error('errors.stripesource.missing-payment-intent')

        const stripeCustomer = await sequelize.models.StripeCustomers.findOneOrCreateOne({
          where: {
            userId: user.id,
            customerRef: user.id.toString(),
          },
        }, { ...input })

        const chargeObject = await sequelize.models.StripeCharges.create({
          orderId: order.id,
          userId: user.id,
          status: 'pending',
        })

        await StripeSources.update({
          isDefault: false,
        }, {
          where: {
            userId: user.id,
          },
        })

        const created = await this.create(input)
        console.log('created: ', created)
        return created
      } catch (e) {
        console.error(e)
        return null
      }
    }
  }

  return StripeSources
}
