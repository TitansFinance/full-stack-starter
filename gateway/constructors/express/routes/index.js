const path = require('path')
const cors = require('cors')
const router = require('express').Router()

module.exports = context => {
  const APIRouter = require('./api')(context)

  if (process.env.NODE_ENV === 'development') {
    router.use('/api', cors(), APIRouter)
  } else {
    router.use('/api', APIRouter)
  }


  router.get('/health', (req, res, next) => res.send({ healthy: true }))
  router.get('/version', (req, res, next) => res.send({ version: context.version }))
  router.get('/api/*', (req, res) => res.status(404).send())

  return router
}
