import React, { Component } from 'react'
import * as log from 'loglevel'
import cx from 'classnames'
import { withRouter } from 'react-router'

import './Footer.sass'


const Footer = withRouter(({ history, match }) => {
  return (
    <footer className="Footer">
      Footer
    </footer>
  )
})

export default {
  Mobile: {
    Public: () => null,
    Private: () => null,
  },
  Desktop: {
    Public: () => null,
    Private: () => null,
  },
}
