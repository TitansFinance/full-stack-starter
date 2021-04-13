module.exports = async (_, $, {}, ast) => {
  try {
    return true
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return false
  }
}

