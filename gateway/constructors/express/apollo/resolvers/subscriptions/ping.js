const { withFilter } = require('graphql-subscriptions')
const { pubsub } = require('@srsl/tools/constructors/graphql-subscriptions')

module.exports = {
  resolve: (payload, variables, context, info) => {
    return payload
  },
  subscribe: withFilter(() => pubsub.asyncIterator(['ping']), (payload, variables, context, info) => {
    return true
  }),
}
