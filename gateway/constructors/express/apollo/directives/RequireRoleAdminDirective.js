const { path } = require('ramda')

/*
 * RequireRoleAdminDirective
**/
module.exports = async (next, source, args, context) => {
  console.log('[RequireRoleAdminDirective] Checking user role...')
  try {
    const { models, session, user } = context
    if (!user.roles.includes('ADMIN')) {
      throw new Error('errors.RequireRoleAdminDirective.not-authorized')
    }
    return next(source, args, context)
  } catch(error) {
    console.error(error)
    return null
  }
}
