import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, split, Observable } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'
// import localStorage from '@/constructors/localStorage'
import fetch from 'isomorphic-unfetch'

const GATEWAY_HOST = process.env.GATEWAY_HOST || '127.0.0.1'
const GATEWAY_PORT = process.env.GATEWAY_PORT || '8000'
const GATEWAY_URL = process.env.GATEWAY_URL || `http://${GATEWAY_HOST}:${GATEWAY_PORT}`


// Polyfill fetch() on the server (used by apollo-client)
if (typeof window === 'undefined') global.fetch = fetch


let apolloClient = null

const connectionParams = async ({ tokenType }) => {
  // const accessToken = await localStorage.getItem('accessToken')
  // if (accessToken) {
  //   return {
  //     authorization: `${tokenType} ${accessToken}`,
  //   }
  // } else {
  //   return {}
  // }
}

const request = async (operation) => await operation.setContext(connectionParams({ tokenType: 'Bearer' }))

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


function create(initialState) {
  const isBrowser = typeof window !== 'undefined'

  /* Server URIs must be absolute */
  const serverHttpLinkUri = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${GATEWAY_HOST}:${GATEWAY_PORT}/graphql` // Server URL (must be absolute)
  const clientHttpLinkUri = '/graphql'
  const serverWsLinkUri = `ws://${GATEWAY_HOST}:${GATEWAY_PORT}/subscriptions`
  const clientWsLinkUri = isBrowser ? `${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${window.location.host}/subscriptions` : '/subscriptions' // hacky, never used in server runtime


  // Create an http link:
  const httpLink = new HttpLink({
    // uri: process.env.APOLLO_HTTP_URI || `${`${process.env.GATEWAY_URL}` || window.location.origin}/graphql`,
    uri: isBrowser ? clientHttpLinkUri : serverHttpLinkUri,
  })

  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    // uri: process.env.APOLLO_WEBSOCKET_URI || `${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${process.env.GATEWAY_HOST || window.location.host}/subscriptions`,
    uri: isBrowser ? clientWsLinkUri : serverWsLinkUri,
    options: {
      reconnect: true,
      connectionParams: connectionParams({ tokenType: 'Bearer' }),
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

  const uploadLink = createUploadLink({ uri: `${GATEWAY_URL || (typeof window !== 'undefined' && window.location.origin)}/graphql` })
  const terminalLink = split(isUpload, uploadLink, requestLink)

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: httpMiddlewareLink.concat(terminalLink),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(initialState)
  }

  // Re-use client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
