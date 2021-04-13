import axios from 'axios'

const client = axios.create({
  baseURL: process.env.FRONTEND_GATEWAY_URL || '/',
})

export default client
