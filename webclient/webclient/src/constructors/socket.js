import SocketIOClient from 'socket.io-client'

const socket = SocketIOClient(process.env.SOCKET_ADDRESS, { transports: ['websocket'] })

socket.on('connect', () => {
  console.log('[SOCKET] connected.')
})

socket.on('event', data => {
  console.log('[SOCKET] event. data: ', data)
})

socket.on('disconnect', () => {
  console.log('[SOCKET] disconnect.')
})


export default socket
