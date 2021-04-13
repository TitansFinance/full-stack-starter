const path = require('path')
const router = require('express').Router()

router.get('*', (req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, '../../../../dist/index.html'))
})


module.exports = router
