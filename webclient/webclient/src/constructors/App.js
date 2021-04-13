import 'normalize.css'
import 'antd/dist/antd.css'

import React from 'react'
import * as log from 'loglevel'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import fastclick from 'fastclick'

import '@/style.sass'

import createReduxStore from '@/constructors/redux/store'
import loglevel from '@/constructors/loglevel'
import sw from '@/constructors/sw'
import web3 from '@/constructors/web3'
import apollo from '@/constructors/apollo'
import ReactRouter from '@/constructors/react-router'

log.info(`Bootstrapping Client (Web) ... (${Date.now()})`)
loglevel()

fastclick.attach(document.body)

const App = () => {
  return (
    <ApolloProvider client={apollo}>
      <Provider store={createReduxStore()}>
        <ReactRouter />
      </Provider>
    </ApolloProvider>
  )
}

export default App
