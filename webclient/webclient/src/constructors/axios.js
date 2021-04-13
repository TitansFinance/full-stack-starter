import axios from 'axios'

const client = axios.create({
  baseURL: process.env.GATEWAY_URL || '/',
})

export default client
