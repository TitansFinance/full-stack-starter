module.exports = async (_, { amount, currency, productId, ...rest }, { validator, models, user, sequelize, stripe }) => {
  if (!amount) throw new Error('missing-required-parameter')
  if (!currency) throw new Error('missing-required-parameter')
  if (!productId) throw new Error('missing-required-parameter')
  try {
    const paymentIntent = await models.StripePaymentIntents.create({
      amount: (parseFloat(amount) * 100).toFixed(0),
      currency,
      productId,
      userId: user.id,
      ...rest,
    })
    console.log('paymentIntent', paymentIntent)
    return paymentIntent.get({ plain: true })
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return false
  }
}
