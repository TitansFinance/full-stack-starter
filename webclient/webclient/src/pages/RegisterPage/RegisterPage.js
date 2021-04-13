import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'

import Loading from '@/components/Loading'
import RegisterForm from '@/components/RegisterForm'
import './RegisterPage.sass'


class RegisterPage extends Component {
  render() {
    const { history } = this.props
    document.title = 'WalletAppTitle - Register'

    return (
      <div>
        <Suspense fallback={<Loading />}>
          <RegisterForm />
        </Suspense>
      </div>
    )
  }
}

export default withRouter(RegisterPage)
