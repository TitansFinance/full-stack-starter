/*
 * Client (Web) - Bootstrap
**/

import React from 'react'
import App from '@/constructors/App'
import { render } from 'react-dom'

export const run = () => {
  render(<App />, document.getElementById('app'))

  if (module.hot) {
    module.hot.accept('@/constructors/App', () => {
      const NextApp = require('@/constructors/App').default
      render(<NextApp />, document.getElementById('app'))
    })
    module.hot.dispose(() => console.log('Module disposed.'))
  }
}
