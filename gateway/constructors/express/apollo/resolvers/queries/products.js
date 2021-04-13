const axios = require('axios')

module.exports = async (_, $, { models }, ast) => {
  try {
    return models.Products.findAll({
      include: [{// Notice `include` takes an ARRAY
        model: models.Investments,
        as: 'investment',
        include: [{
          model: models.ProductProviders,
          as: 'provider',
        }],
      }],
    })
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return false
  }
}

