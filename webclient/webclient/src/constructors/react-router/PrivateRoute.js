import React, { Suspense } from 'react'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'
import {
  Route,
  Redirect,
} from 'react-router-dom'
import { path } from 'ramda'

import LoadingPage from '@/pages/LoadingPage'
import { setLocale } from '@/constructors/moment'
import i18n from '@/constructors/i18n'

const PrivateRoute = ({
  component: Component,
  ...rest
}) => (
  <Route {...rest}
    render={props => {
      return (
        <Query query={gql`{
          me {
            id
            userType
            language {
              key
              name
            }
            currency
            username
          }
        }`}>
          {({ error, loading, data }) => {
            if (loading) return <LoadingPage />
            if (error || !data.me) {
              return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
            const userLanguage = path(['me', 'language'], data)
            if (userLanguage) {
              i18n.changeLanguage(userLanguage)
              setLocale(userLanguage)
            }
            return <Component {...props} {...rest} />
          }}
        </Query>
      )
    }}
  />
)

export default PrivateRoute
