module.exports = async (_, $, {}, ast) => {
  try {
    return 'pong'
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return false
  }
}

