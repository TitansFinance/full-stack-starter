module.exports = async (_, $, { req, session, models, user, pubsub }, ast) => {
  try {
    return await models.Users.findOne({ where: { id } })
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return null
  }
}



