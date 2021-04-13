process.env.PORT = process.env.PORT || 8080
process.env.GATEWAY_HOST = process.env.GATEWAY_HOST || '127.0.0.1'
process.env.GATEWAY_PORT = process.env.GATEWAY_PORT || 8000

require('./constructors/express').run()
