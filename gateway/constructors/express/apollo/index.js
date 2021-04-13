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
  ...rest
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
        ...rest,
      }

      let session
      let user
      let userId
      if (params.connection) {
        console.log('[ApolloServerExpress] Websocket build context')
        // TODO sanitize and session input
        session = params.connection.context.session
        const userId = path(['user', 'id'], session)
        if (userId) {
          user = await models.Users.findOne({ where: { id: userId } })
        }

        return {
          ...ctx,
          ...params.connection.context,
          session,
          user,
        }
      } else {
        console.log('[ApolloServerExpress] HTTP build context')
        const { req, res } = params
        try {
          session = await sessionFromRequest({ req })
          userId = path(['user', 'id'], session)
          if (userId) {
            user = await models.Users.findOne({ where: { id: userId } })
          }
        } catch (err) {
          console.error(err)
          if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({ error: 'invalid-token' })
          }
        }

        return {
          ...ctx,
          req,
          res,
          session,
          user,
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
