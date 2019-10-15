const http = require('http')
const SocketClient = require('socket.io-client')

const run = async ({ io }) => {
  console.log('[Sockets] Bootrapping...')
  const injection = {
    SocketClient,
  }
  // const [replicator] = await Promise.all([
  //   await require('./replicator')(injection),
  // ])
  return {
    io,
    // sockets: {
    //   replicator,
    // },
  }
}

module.exports = run
