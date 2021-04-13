const fs = require('fs')
const path = require('path')

const requireFilesFromDir = (dirPath) => {
  return fs.readdirSync(path.resolve(__dirname, dirPath)).reduce((acc, file) => {
    return {
      ...acc,
      [file.split('.').slice(0, -1).join('.')]: require(`${dirPath}/${file}`),
    }
  }, {})
}


const resolvers = {
  Query: requireFilesFromDir('./queries'),
  Mutation: requireFilesFromDir('./mutations'),
  // Subscriptions: requireFilesFromDir('./subscriptions'),
  JSON: require('graphql-type-json'),
  Upload: require('graphql-upload').GraphQLUpload,
  User: require('./types/User'),
  // Account: require('./types/Account'),
}

module.exports = resolvers
