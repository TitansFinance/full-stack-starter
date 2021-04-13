const router = require('express').Router()

const v1 = context => {
  return router
}

module.exports = (context) => {
  router.get('/health', (req, res, next) => res.send({ healthy: true }))
  router.get('/version', (req, res, next) => res.send({ version: require('@/package.json').version }))
  router.use('/v1', v1(context))
  return router
}
