const router = require('express').Router()
const { sessionFromRequest } = require('@srsl/tools/utils/session')
const { get } = require('lodash')

module.exports = ({ models }) => {
  router.delete('/', async (req, res) => {
    try {
      const type = get(req.body, 'type')
      const where = get(req.body, 'where')
      const model = models[type]
      if (!model) throw new Error('Invalid Entity Type')

      return res.status(200).json({ result: await model.destroy({ where }) })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'unknown' })
    }
  })
  return router
}
