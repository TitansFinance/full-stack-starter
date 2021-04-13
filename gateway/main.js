/*
 * Server (Gateway) - Bootstrap
**/

const path = require('path')

module.exports.run = async () => {
  console.log(`[Gateway][Main] Version ${require('^/package.json').version} ... (${Date.now()})`)
  console.log('[Gateway][Main] Connecting to databases...')

  const [postgres, redis, { io }] = await Promise.all([
    await require(`@srsl/tools/constructors/postgres`)(),
    await require(`@srsl/tools/singletons/redis`),
    await require(`@srsl/tools/singletons/io`),
  ])

  const sockets = await require(`./constructors/sockets`)({ io })


  const {
    sequelize,
    Sequelize,
    models,
  } = require('./constructors/sequelize')({}) // TODO modelsPath: path.resolve(__dirname, './constructors/sequelize/models')

  const expressContext = {
    postgres,
    redis,
    io,
    sequelize,
    Sequelize,
    models,
    session: true,
  }

  console.log('[Gateway][Main] Starting Express Server...')
  const server = await require(`@srsl/tools/constructors/express`)({
    apolloServerExpress: require('./constructors/express/apollo')(expressContext),
    routes: require('./constructors/express/routes')(expressContext),
    ...expressContext,
  })

  if (process.env.MIGRATE_ON_BOOTSTRAP === 'true') await require('@srsl/tools/bin/sequelizeMigrate')()
  if (process.env.SEED_ON_BOOTSTRAP === 'true') await require('@srsl/tools/bin/sequelizeSeed')()
}
