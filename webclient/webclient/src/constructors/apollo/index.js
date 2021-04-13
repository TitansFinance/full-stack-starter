import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, split, Observable } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'

import localStorage from '@/constructors/localStorage'


const request = async (operation) => {
  const tokenType = 'Bearer'
  const accessToken = await localStorage.getItem('accessToken')
  if (accessToken) {
    operation.setContext({
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      }
    })
  }
}

const httpMiddlewareLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        })
      })
      .catch(observer.error.bind(observer))

    return () => {
      if (handle) handle.unsubscribe()
    }
  })
)

// Create an http link:
const httpLink = new HttpLink({
  uri: process.env.APOLLO_HTTP_URI || `${`${process.env.GATEWAY_URL}` || window.location.origin}/graphql`,
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: process.env.APOLLO_WEBSOCKET_URI || `${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${process.env.GATEWAY_HOST || window.location.host}/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: async () => {
      const tokenType = 'Bearer'
      const accessToken = await localStorage.getItem('accessToken')
      if (accessToken) {
        return {
          authorization: `${tokenType} ${accessToken}`,
        }
      }
    },
  },
})

const isFile = value => (
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob)
);

const isUpload = ({ variables }) => Object.values(variables).some(isFile);

const isSubscriptionOperation = ({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === 'OperationDefinition' && operation === 'subscription';
};

const requestLink = split(
  isSubscriptionOperation,
  wsLink,
  httpLink,
)

const uploadLink = createUploadLink({ uri: `${process.env.GATEWAY_URL || window.location.origin}/graphql` })
const terminalLink = split(isUpload, uploadLink, requestLink)


const client = new ApolloClient({
  link: httpMiddlewareLink.concat(terminalLink),
  cache: new InMemoryCache(),
})


export default client
