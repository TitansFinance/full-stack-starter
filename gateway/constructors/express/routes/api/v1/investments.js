const router = require('express').Router()
const { sessionFromRequest } = require('@srsl/tools/utils/session')

module.exports = ({ models }) => {
  router.get('/', async (req, res) => {
    try {
      return res.status(200).json({ result: await models.Investments.findAll() })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'unknown' })
    }
  })
  return router
}
