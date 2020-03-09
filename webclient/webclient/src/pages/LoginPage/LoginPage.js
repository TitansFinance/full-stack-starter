import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'

import LoginForm from '@/components/LoginForm'
import './LoginPage.sass'


class LoginPage extends Component {
  render() {
    const { classes } = this.props
    document.title = 'WalletAppTitle - Login'
    
    return (
      <div className="Page LoginPage">
        <LoginForm />
      </div>
    )
  }
}

export default withRouter(LoginPage)
