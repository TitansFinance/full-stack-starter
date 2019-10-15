import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { initStore } from '../constructors/redux/store'

import { MuiThemeProvider } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import blue from '@material-ui/core/colors/blue'
import red from '@material-ui/core/colors/red'


import '../styles/index.sass'


class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps, store } = this.props
    return (
      <MuiThemeProvider theme={createMuiTheme({
        /* https://material-ui.com/customization/themes/ */
        palette: {
          // primary: blue,
          // secondary: green,
          // error: red,
        },
        status: {
          danger: red,
        },
      })}>
        <CssBaseline />
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </MuiThemeProvider>
    )
  }
}

export default withRedux(initStore)(MyApp)
