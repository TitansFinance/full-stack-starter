const bcrypt = require('bcrypt')
const { Model } = require('sequelize')


const SALT_ROUNDS = 10

module.exports = (sequelize, DataTypes, ...rest) => {

  class Users extends Model {
    static isNewFormat() { return true }
    static init(sequelize, DataTypes) {
      return super.init({
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        email: DataTypes.STRING,
        passwordHash: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        birthDate: DataTypes.DATE,
        phone: DataTypes.STRING,
        phoneCountryCode: DataTypes.INTEGER,
        isEmailVerified: DataTypes.BOOLEAN,
        isPhoneVerified: DataTypes.BOOLEAN,
        language: {
          type: DataTypes.ENUM({
            values: [
              'en',
              'zh',
            ],
          }),
          defaultValue: 'en',
        },
        currency: {
          type: DataTypes.ENUM({
            values: [
              'USD',
              'CNY',
            ],
          }),
          defaultValue: 'USD',
        },
        settings: DataTypes.JSONB,
        role: {
          type: DataTypes.ENUM({
            values: ['admin', 'user'],
          }),
          defaultValue: 'user',
        },
        consumerType: {
          type: DataTypes.ENUM({
            values: ['individual', 'business'],
          }),
        },
        sex: {
          type: DataTypes.ENUM({
            values: ['man', 'woman'],
          }),
        },
        gender: {
          type: DataTypes.ENUM({
            values: [
              'cis-male',
              'cis-female',
              'gay-male',
              'gay-female',
              'transgender-male',
              'transgender-female',
              'other',
            ],
          }),
        },
        primaryAddressId: DataTypes.INTEGER,
        accountId: DataTypes.INTEGER,
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: sequelize.fn('NOW'),
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: sequelize.fn('NOW'),
        },
        fullName: {
          type: DataTypes.VIRTUAL,
          get() {
            return this.getDataValue('firstName') + ' ' + this.getDataValue('lastName')
          },
        },
      }, {
        sequelize,
        modelName: 'Users',
        schema: 'gateway',
      })
    }

    static associate(models) {
      this.user = this.belongsToMany(models.Users, {
        through: 'Friends',
        as: 'friends',
        foreignKey: 'friendId',
      })
      this.order = this.hasMany(models.Orders, {
        as: 'order',
        foreignKey: 'userId',
      })

      this.stripeSources = this.hasMany(models.StripeSources, {
        as: 'stripeSources',
        foreignKey: 'userId',
      })

      this.stripePaymentIntents = this.hasMany(models.StripePaymentIntents, {
        as: 'stripePaymentIntents',
        foreignKey: 'userId',
      })

      this.stripeCharges = this.hasMany(models.StripeCharges, {
        as: 'stripeCharges',
        foreignKey: 'userId',
      })

    }

  }

  return Users
}
