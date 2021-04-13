const { createSession } = require('@srsl/tools/utils/session')

// const verifyEmail = async ({ redis, email, emailVerificationCode }) => {
//   if (!email) throw new Error('errors.signup.identifier-required')
//   if (!emailVerificationCode) throw new Error('errors.signup.no-code')
//   const savedEmailVerificationCode = await redis.getAsync(`${email}-email-verification-code`)
//   if (emailVerificationCode !== savedEmailVerificationCode) {
//     throw new Error('errors.signup.incorrect-code')
//   }
//   return true
// }

// const verifyPhone = async ({ redis, phone, phoneVerificationCode }) => {
//   if (!phone) throw new Error('errors.signup.identifier-required')
//   if (phone && !phoneVerificationCode) throw new Error('errors.signup.no-code')
//   const savedPhoneVerificationCode = await redis.getAsync(`${phone}-phone-verification-code`)
//   if (phoneVerificationCode !== savedPhoneVerificationCode) {
//     throw new Error('errors.signup.incorrect-code')
//   }
//   return true
// }

module.exports = async (_, payload, { req, res, models, sequelize, redis }) => {
  const transaction = await sequelize.transaction()
  try {
    console.log('payload: ', payload)
    const {
      email,
      // emailVerificationCode,
      // phoneVerificationCode,
      token,
      referrerEmail,
      password,
    } = payload

    if (!email) throw new Error('errors.signup.email-required')
    if (!password) throw new Error('errors.signup.password-required')
    if (!token) throw new Error('errors.signup.token-required')
      debugger;
    const user = await models.Users.createWithSignupToken(payload, { transaction })
    if (!user) throw new Error('errors.signup.generic')
    // await verifyEmail({ redis, email, emailVerificationCode })

    // await verifyPhone({ redis, phone, phoneVerificationCode })
    // input.phoneVerified = true

    await transaction.commit()

    const tokenData = await createSession({ req, res, user })

    res.set({
      'Cache-Control': process.env.NODE_ENV === 'production' ? 'private' : 'public',
      'Access-Control-Allow-Headers': 'authorization,cache-control,content-type,X-Requested-With',
      'authorization': `Bearer ${tokenData.accessToken}`,
    })
    res.cookie('authorization', tokenData.accessToken, { maxAge: 900000, httpOnly: true })

    // TODO - use login for tokenData, remove from signup
    return {
      user: user.get({ plain: true }),
      tokenData, /* Create user session */
    }
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    await transaction.rollback()
    return error
  }
}