module.exports = {
  Query: {
    supportedLanguages: require('./queries/supportedLanguages'),
    health: require('./queries/health'),
    me: require('./queries/me'),
  },
  Mutation: {
    signup: require('./mutations/signup'),
    login: require('./mutations/login'),
    logout: require('./mutations/logout'),
    refreshToken: require('./mutations/refreshToken'),
  },
  JSON: require('graphql-type-json'),
  Upload: require('graphql-upload').GraphQLUpload,
}
