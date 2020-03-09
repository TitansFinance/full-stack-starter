const express = require('express')
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware').default
const proxyMiddleware = require('http-proxy-middleware')
const cors = require('cors')

const nextI18next = require('../constructors/next-i18next')

const port = process.env.PORT || 3000
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler();

const GATEWAY_HOST = process.env.GATEWAY_HOST || '127.0.0.1'
const GATEWAY_PORT = process.env.GATEWAY_PORT || '8000'

const proxy = {
  '/api': {
    target: `http://${GATEWAY_HOST}:${GATEWAY_PORT}`,
    secure: false,
  },
  '/graphql': {
    target: `http://${GATEWAY_HOST}:${GATEWAY_PORT}`,
    secure: false,
  },
  '/subscriptions':  {
    target: `ws://${GATEWAY_HOST}:${GATEWAY_PORT}`, // TODO wss
    secure: false,
    ws: true,
  },
}

module.exports = async function main () {
  await app.prepare()
  const server = express()

  server.use(cors())
  /* Set API proxies */
  Object.entries(proxy).forEach(([context, target]) => server.use(proxyMiddleware(context, target)))
  /* i18n middleware */
  server.use(nextI18NextMiddleware(nextI18next))
  /* Standard page routing */
  server.get('*', (req, res) => handle(req, res))

  await server.listen(port)
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
}
