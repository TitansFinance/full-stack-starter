const router = require('express').Router()

module.exports = (context) => {
  router.use('/v1', require('./v1')(context))
  router.use('/stripe', require('./stripe')(context))
  return router
}
