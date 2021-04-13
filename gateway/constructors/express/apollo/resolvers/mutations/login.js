const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const { createSession } = require('@srsl/tools/utils/session')

const SALT_ROUNDS = 10 // TODO bcrypt shared vars
const LOGIN_FAILED_ATTEMPTS_TIMEOUT = 30 /* 30 seconds */

module.exports = async (_, {
  email,
  password,
}, { req, res, models, redis }) => {
  try {
    // TODO sanitize and standardize inputs
    if (!email) throw new Error('errors.auth.no-email')
    if (!password) throw new Error('errors.auth.no-password')

    // const numLoginAttempts = await redis.getAsync(`${email}-login-failed-attempts`)
    // if (parseInt(numLoginAttempts, 10) >= 5) throw new Error('errors.auth.max-attempts')

    const user = await models.Users.findOne({
      where: { email },
    })


    if (!user) throw new Error('errors.auth.no-user')

    const match = await bcrypt.compare(password, user.passwordHash)

    if (!match) {
      // await redis.setAsync(`${email}-login-failed-attempts`, numLoginAttempts + 1, 'EX', LOGIN_FAILED_ATTEMPTS_TIMEOUT)
      throw new Error('errors.auth.incorrect-credentials')
    }

    /* Create user session */
    const tokenData = await createSession({ req, res, user })
    res.set({
      'Cache-Control': process.env.NODE_ENV === 'production' ? 'private' : 'public',
      'Access-Control-Allow-Headers': 'authorization,cache-control,content-type,X-Requested-With',
      'authorization': `Bearer ${tokenData.accessToken}`,
    })
    res.cookie('authorization', tokenData.accessToken, { maxAge: 900000, httpOnly: true })

    return {
      tokenData,
      user: user.get({ plain: true }),
    }
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return error
  }
}
