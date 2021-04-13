import React, { useEffect } from 'react'
// import { gql } from 'apollo-boost'
// import { Query } from 'react-apollo'
import {
  Router,
  // Link,
  // Redirect,
  // Route,
  Switch,
} from 'react-router-dom'
// import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import history from '@/constructors/history'

/* Public */
import HomePage from '@/pages/HomePage'
import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'

/* Private */
import AboutPage from '@/pages/AboutPage'
import DashboardPage from '@/pages/DashboardPage'
import LegalPage from '@/pages/LegalPage'
import NotificationsPage from '@/pages/NotificationsPage'
import UserSettingsProfilePage from '@/pages/UserSettingsProfilePage'
import UserSettingsSecurityPage from '@/pages/UserSettingsSecurityPage'
import UserSettingsGeneralPage from '@/pages/UserSettingsGeneralPage'

import Layout from '@/components/Layout'
import ResizeListener from '@/components/ResizeListener'

import DualRoute from './DualRoute'
// import PublicRoute from './PublicRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import PrivateRoute from './PrivateRoute'


const getRouter = ({ layout, history }) => {
  let router = null
  switch (layout.type) {
    case 'mobile':
    case 'tablet':
      router = (
        <Router history={history}>
          <Switch>
            <PublicOnlyRoute exact path="/login" layoutComponent={Layout.Mobile.Public} component={LoginPage} />
            <PublicOnlyRoute exact path="/register" layoutComponent={Layout.Mobile.Public} component={RegisterPage} />
            <PublicOnlyRoute exact path="/resetpassword" layoutComponent={Layout.Mobile.Public} component={ResetPasswordPage} />
            <DualRoute
              exact
              path="/"
              AuthComponent={DashboardPage.Mobile}
              NoAuthComponent={HomePage}
              AuthLayout={Layout.Mobile.Private}
              NoAuthLayout={Layout.Mobile.Public}
            />
            <Layout.Mobile.Private>
              <PrivateRoute exact path="/about" component={AboutPage} />
              <PrivateRoute exact path="/legal" component={LegalPage} />
              <PrivateRoute exact path="/notifications" component={NotificationsPage} />
              <PrivateRoute exact path="/settings/user/profile" component={UserSettingsProfilePage} />
              <PrivateRoute exact path="/settings/user/security" component={UserSettingsSecurityPage} />
              <PrivateRoute exact path="/settings/user/general" component={UserSettingsGeneralPage} />
            </Layout.Mobile.Private>
          </Switch>
        </Router>
      )
      break
    case 'desktop':
      router = (
        <Router history={history}>
          <Switch>
            <PublicOnlyRoute exact path="/login" layoutComponent={Layout.Desktop.Public} component={LoginPage} />
            <PublicOnlyRoute exact path="/register" layoutComponent={Layout.Desktop.Public} component={RegisterPage} />
            <PublicOnlyRoute exact path="/resetpassword" layoutComponent={Layout.Desktop.Public} component={ResetPasswordPage} />
            <DualRoute
              exact
              path="/"
              AuthComponent={DashboardPage.Desktop}
              NoAuthComponent={HomePage}
              AuthLayout={Layout.Desktop.Private}
              NoAuthLayout={Layout.Desktop.Public}
            />
            <Layout.Desktop.Private>
              <PrivateRoute exact path="/about" component={AboutPage} />
              <PrivateRoute exact path="/legal" component={LegalPage} />
              <PrivateRoute exact path="/notifications" component={NotificationsPage} />
              <PrivateRoute exact path="/settings/user/profile" component={UserSettingsProfilePage} />
              <PrivateRoute exact path="/settings/user/security" component={UserSettingsSecurityPage} />
              <PrivateRoute exact path="/settings/user/general" component={UserSettingsGeneralPage} />
            </Layout.Desktop.Private>
          </Switch>
        </Router>
      )
      break
    default: // no-op
  }
  return router
}

const ReactRouter = React.memo(connect(
  state => ({
    layout: state.layout,
  })
)(React.memo(({ layout }) => {
  // console.log(history)
  history.listen((location, action) => {
    return true
  })

  useEffect(() => {

  }, [layout])

  return (
    <>
      {getRouter({ layout, history })}
      <ResizeListener />
    </>
  )
})))


export default ReactRouter
