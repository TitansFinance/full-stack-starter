module.exports = async (_, { orderId }, { validator, models, user }) => {
  try {
    if (!orderId) throw new Error('missing-required-parameter')

    const charge = await models.StripeCharges.create({
      orderId,
      userId: user.id,
    })
    console.log(charge)
    return charge ? charge.get({ plain: true }) : null
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return false
  }
}
