const { destroySession } = require('@srsl/tools/utils/session')

module.exports = async (_, $, { req, res }) => {
  try {
    await destroySession({ req })
    res.removeHeader('authorization')
    res.setHeader('set-cookie', 'authorization=; max-age=0')
    res.setHeader('set-cookie', 'connect.sid=; max-age=0')
    return true
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return false
  }
}