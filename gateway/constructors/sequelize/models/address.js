const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Addresses extends Model {
    static isNewFormat() { return true }
    static init(sequelize, DataTypes) {
      return super.init({
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        address1: DataTypes.STRING,
        address2: DataTypes.STRING,
        address3: DataTypes.STRING,
        country: DataTypes.ENUM({
          values: ['USA', 'CN'],
        }),
        state: DataTypes.STRING,
        city: DataTypes.STRING,
        zipcode: DataTypes.INTEGER,
      }, {
        sequelize,
        modelName: 'Addresses',
        schema: 'gateway',
      })
    }

    static associate(models) {
      this.users = this.belongsToMany(models.Users, {
        through: 'AddressUsers',
        as: 'addresses',
        foreignKey: 'addressId',
      })
    }
  }

  return Addresses
}
