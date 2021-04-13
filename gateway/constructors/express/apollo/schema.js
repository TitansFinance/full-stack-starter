const { makeExecutableSchema } = require('graphql-tools')
const { mergeTypeDefs } = require('graphql-toolkit')

const resolvers = require('./resolvers')
const AuthorizedUserDirective = require('./directives/AuthorizedUserDirective')
const RequireRoleAdminDirective = require('./directives/RequireRoleAdminDirective')

// TODO just read from files to reduce boilerplate
const root = require('./types/root.graphql')
const Query = require('./types/Query.graphql')
// const Mutation = require('./types/Mutation.graphql')
const File = require('./types/File.graphql')
const SupportedLanguage = require('./types/SupportedLanguage.graphql')


module.exports = makeExecutableSchema({
  typeDefs: mergeTypeDefs([
    root,
    Query,
    // Mutation,
    File,
    SupportedLanguage,
  ]),
  resolvers,
  directiveResolvers: {
    AuthorizedUser: AuthorizedUserDirective,
    RequireRoleAdmin: RequireRoleAdminDirective,
  },
})
