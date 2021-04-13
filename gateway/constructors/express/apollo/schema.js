const fs = require('fs')
const path = require('path')
const { makeExecutableSchema } = require('graphql-tools')
const { mergeTypeDefs } = require('graphql-toolkit')
const ConstraintDirective = require('graphql-constraint-directive')

const resolvers = require('./resolvers')
const AuthorizedUserDirective = require('./directives/AuthorizedUserDirective')
const RequireRoleAdminDirective = require('./directives/RequireRoleAdminDirective')

const requireFilesArrayFromDir = (dirPath) => {
  return fs.readdirSync(path.resolve(__dirname, dirPath)).map((file) => {
    return require(`${dirPath}/${file}`)
  })
}

const typeDefs = requireFilesArrayFromDir('./types')

module.exports = makeExecutableSchema({
  typeDefs: mergeTypeDefs(typeDefs),
  resolvers,
  directiveResolvers: {
    AuthorizedUser: AuthorizedUserDirective,
    RequireRoleAdmin: RequireRoleAdminDirective,
  },
  schemaDirectives: { constraint: ConstraintDirective },
})
