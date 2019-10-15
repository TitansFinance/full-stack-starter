const resolvers = {
  Query: {
    supportedLanguages: require('./queries/supportedLanguages'),
    health: require('./queries/health'),
  },
  // Mutation: {},
  JSON: require('graphql-type-json'),
  Upload: require('graphql-upload').GraphQLUpload,
}

module.exports = resolvers
