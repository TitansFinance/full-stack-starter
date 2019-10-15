module.exports = async (_, $, { req, session, models, user, pubsub }, ast) => {
  try {
    return [
      { key: 'en', name: 'English' },
      { key: 'zh', name: '中文' },
    ]
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return null
  }
}
