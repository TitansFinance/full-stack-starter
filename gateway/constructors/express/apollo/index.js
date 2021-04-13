const { path } = require('ramda')
const { ApolloServer } = require('apollo-server-express')
const { execute, subscribe } = require('graphql')
const qs = require('query-string')
const axios = require('axios')

const { pubsub } = require('@srsl/tools/constructors/graphql-subscriptions')
const { sessionFromRequest, sessionFromConnectionParams } = require('@srsl/tools/utils/session')
const schema = require('./schema')
const resolvers = require('./resolvers')


module.exports = ({
  io,
  sequelize,
  models,
  sockets,
  redis,
}) => new ApolloServer({
  schema,
  resolvers,
  // tracing: true,
  context: async (params) => {
    try {
      const ctx = {
        redis,
        sockets,
        io,
        sequelize,
        models,
        pubsub,
        axios,
        qs,
      }

      if (params.connection) {
        console.log('[ApolloServerExpress] Websocket build context')
        let user
        // TODO sanitize and session input
        const id = path(['user', 'id'], params.connection.context.session)
        if (id) {
          user = await models.Users.findOne({ where: { id } })
        }

        return {
          ...ctx,
          ...params.connection.context,
          user,
        }
      } else {
        console.log('[ApolloServerExpress] HTTP build context')
        const { req, res } = params
        return {
          ...ctx,
          req,
          res,
          session: await sessionFromRequest({ req }),
        }
      }
    } catch (error) {
      console.error(error)
      return {}
    }
  },
  playground: process.env.NODE_ENV !== 'production' ? ({
    endpoint: '/graphql',
    subscriptionEndpoint: '/subscriptions',
  }) : false,
  introspection: process.env.NODE_ENV !== 'production',
  subscriptions: {
    path: '/subscriptions',
    onConnect: async (connectionParams, webSocket, context) => {
      console.log('[ApolloServerExpress][Subscriptions] connected.')
      try {
        const session = await sessionFromConnectionParams({ connectionParams })
        return {
          session,
        }
      } catch (error) {
        return {}
      }
    },
    onDisconnect: (webSocket, context) => {
      console.log('[ApolloServerExpress][Subscriptions] disconnected.')
    },
  },
})
