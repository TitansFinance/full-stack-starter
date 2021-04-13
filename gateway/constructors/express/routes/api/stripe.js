const router = require('express').Router()

const StripePaymentIntentStatus = {
  'succeeded': 'succeeded',
  'created': 'created',
  'failed': 'failed',
  'canceled': 'canceled',
}

const StripeChargeStatus = {
  'pending': 'pending',
  'succeeded': 'succeeded',
  'failed': 'failed',
}

module.exports = ({ models }) => {
  router.post('/webhook', async (req, res) => {
    try {
      const event = req.body
      console.log('stripe webhook body: ', event)
      switch (event.type) {
        // https://stripe.com/docs/payments/payment-intents/verifying-status#webhooks
        // https://stripe.com/docs/webhooks

        case 'payment_intent.succeeded':
          await models.StripePaymentIntents.update({ status: StripePaymentIntentStatus.succeeded }, { where: { paymentIntentRef: event.data.object.id }})
          break

        case 'payment_intent.created':
          await models.StripePaymentIntents.update({ status: StripePaymentIntentStatus.created }, { where: { paymentIntentRef: event.data.object.id }})
          break

        case 'payment_intent.payment_failed':
          await models.StripePaymentIntents.update({ status: StripePaymentIntentStatus.failed }, { where: { paymentIntentRef: event.data.object.id }})
          break

        case 'payment_intent.canceled':
          await models.StripePaymentIntents.update({ status: StripePaymentIntentStatus.canceled }, { where: { paymentIntentRef: event.data.object.id }})
          break

          // ACH charges has 3 events pending/succeeded/failed according to these two docs
          // https://stripe.com/docs/ach
          // https://stripe.com/docs/sources/best-practices

          // however CLI implements some different workdflow
          // https://github.com/stripe/stripe-cli/wiki/trigger-command#supported-events

        case 'charge.pending':
          await models.StripeCharges.webhookUpdate({ status: StripeChargeStatus.pending }, { where: { chargeRef: event.data.object.id }})
          break

        case 'charge.succeeded':
          await models.StripeCharges.webhookUpdate({ status: StripeChargeStatus.succeeded }, { where: { chargeRef: event.data.object.id }})
          break

        case 'charge.failed':
          await models.StripeCharges.webhookUpdate({ status: StripeChargeStatus.failed }, { where: { chargeRef: event.data.object.id }})
          break

        default:
          break
      }

      return res.status(200).json({})
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'unknown' })
    }
  })
  return router
}
