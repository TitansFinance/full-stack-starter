module.exports = async (_, { id, values }, { validator, models, user }) => {
  try {
    const stripeSource = await models.StripeSources.update(
      { ...values },
      {
        where: {
          id,
          userId: user.id,
        },
      })
    return stripeSource.get({ plain: true })
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return false
  }
}
