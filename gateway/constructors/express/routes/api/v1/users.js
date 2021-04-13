const router = require('express').Router()
const { sessionFromRequest } = require('@srsl/tools/utils/session')

module.exports = ({ models }) => {
  router.get('/me', async (req, res) => {
    try {
      const session = await sessionFromRequest({ req })
      if (session && session.user) {
        // NOTE: if the db has changed, and userId no longer matches, the token may still be valid, resulting in a false positive.
        return res.status(200).json({})
      } else {
        res.setHeader('set-cookie', 'authorization=; max-age=0')
        res.setHeader('set-cookie', 'connect.sid=; max-age=0')
        return res.status(404).json(null)
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'unknown' })
    }
  })
  return router
}
