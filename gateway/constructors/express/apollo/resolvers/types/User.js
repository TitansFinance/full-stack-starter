const { Op } = require('sequelize')
module.exports = {
  async stripeSources(obj, args, { models, user }, info) {
    return await models.StripeSources.findAll({
      where: {
        userId: user.id,
        disabled: false,
      },
    }) || []
  },
}
