const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class ProductProviders extends Model {
    static isNewFormat() { return true }
    static init(sequelize, DataTypes) {
      return super.init({
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        slug: DataTypes.STRING,
      }, {
        sequelize,
        modelName: 'ProductProviders',
        schema: 'gateway',
      })
    }

    static associate(models) { }

  }

  return ProductProviders
}
