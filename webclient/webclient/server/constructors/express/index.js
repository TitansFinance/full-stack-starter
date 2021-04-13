const path = require('path')
const http = require('http')
const httpProxy = require('http-proxy')
const morgan = require('morgan')
const express = require('express')
const expressHttpProxy = require('express-http-proxy')
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')

module.exports.run = () => {
  const app = express()

  console.log(`Proxying to : ${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`)
  app.set('view engine', 'ejs')
  app.set('views', path.resolve(__dirname, './views'))
  app.use(compression())
  app.use(morgan('tiny'))
  app.use(express.static(path.resolve(__dirname, '../../static')))
  app.use(express.static(path.resolve(__dirname, '../../../dist')))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.disable('x-powered-by')
  app.enable('trust proxy')

  var proxy = httpProxy.createProxyServer({
    target: {
      host: process.env.GATEWAY_HOST,
      port: process.env.GATEWAY_PORT,
    },
    // ws: true,
  })

  app.on('open', function (req, socket, head) {console.log('open')})
  app.on('close', function (req, socket, head) {console.log('close')})
  app.on('error', function (req, socket, head) {console.log('error')})
  app.on('proxyReq', function (req, socket, head) {console.log('proxyReq')})
  app.on('proxyReqWs', function (req, socket, head) {console.log('proxyReqWs')})
  app.on('proxyRes', function (req, socket, head) {console.log('proxyRes')})

  app.use(`/api`, function (req, res) { proxy.web(req, res) })
  app.use(`/graphql`, function (req, res) { proxy.web(req, res) })
  app.use(`/subscriptions`, function (req, res) { proxy.web(req, res) })
  app.use(`/socket.io`, function (req, res) { proxy.ws(req, res) })

  // app.use('/api', proxy(process.env.GATEWAY_URL, {
  //   proxyReqPathResolver: () => '/api',
  // }))
  // app.use('/graphql', proxy(process.env.GATEWAY_URL, {
  //   proxyReqPathResolver: () => '/graphql',
  // }))
  // app.use('/subscriptions', proxy(process.env.GATEWAY_URL, {
  //   proxyReqPathResolver: () => '/subscriptions',
  // }))
  // app.use('/socket.io', proxy(process.env.GATEWAY_URL, {
  //   proxyReqPathResolver: () => '/socket.io',
  // }))

  app.use('/', require('./routes'))

  const httpServer = http.createServer(app)
  httpServer.listen(process.env.PORT, () => {
    console.log(`Express server listening on port ${process.env.PORT}`)
  })

  return { app, httpServer, proxy }
}
