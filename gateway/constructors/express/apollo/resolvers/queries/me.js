module.exports = async (_, $, { models, user, ...rest }, ast) => {
  try {
    return user
  } catch (error) {
    console.error(`errors.queries.${__filename}`, error)
    return false
  }
}

