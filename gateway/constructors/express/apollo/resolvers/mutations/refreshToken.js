const { createSession, sessionFromRefreshToken } = require('@srsl/tools/utils/session')

// TODO
module.exports = async (_, { refreshToken }, { redis, res }) => {
  try {
    const session = await sessionFromRefreshToken(redis, refreshToken)
    if (!session) throw new Error('unauthorized')
    const tokenData = await createSession({ req, res, user })

    res.set({
      'Cache-Control': process.env.NODE_ENV === 'production' ? 'private' : 'public',
      'Access-Control-Allow-Headers': 'authorization,cache-control,content-type,X-Requested-With',
      'authorization': `Bearer ${tokenData.accessToken}`,
    })
    res.cookie('authorization', tokenData.accessToken, { maxAge: 900000, httpOnly: true })

    return tokenData
  } catch (e) {
    console.error(`errors.${__filename}`, error)
    throw e
  }
}
