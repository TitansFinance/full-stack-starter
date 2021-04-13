module.exports = async (_, { id }, { validator, models, user, sequelize }) => {
  try {
    const source = await models.StripeSources.findOne({ where: { id } })
    return await source.setDefault()
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return false
  }
}
