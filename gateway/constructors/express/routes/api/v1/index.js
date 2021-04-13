const router = require('express').Router()

const users = require('./users')
const investments = require('./investments')
const productproviders = require('./productproviders')
const datastage = require('./datastage')


module.exports = (context) => {
  router.use('/users', users(context))
  router.use('/investments', investments(context))
  router.use('/productproviders', productproviders(context))
  if (process.env.DATA_STAGE_ENABLED === 'TRUE') {
    router.use('/datastage', datastage(context))
  }
  return router
}
