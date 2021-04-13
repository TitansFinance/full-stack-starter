module.exports = async (_, { plaidToken, account, description, metadata }, { validator, models, user }) => {
  try {
    if (!plaidToken) throw new Error('missing-required-parameter')
    if (!account) throw new Error('missing-required-parameter')

    const stripeSource = await models.StripeSources.create({
      plaidToken,
      account,
      userId: user.id,
      isDefault: true,
      metadata,
    })

    return stripeSource ? stripeSource.get({ plain: true }) : null
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return false
  }
}
