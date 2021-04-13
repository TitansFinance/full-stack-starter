const Stripe = require('stripe')

module.exports = new Stripe(process.env.STRIPE_PRIVATE_KEY)
