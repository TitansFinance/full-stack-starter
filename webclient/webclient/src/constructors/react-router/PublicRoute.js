import React from 'react'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'
import {
  Route,
} from 'react-router-dom'


const PublicRoute = ({ component: Component, layoutComponent: LayoutComponent, ...rest }) => (
  <Route {...rest}
    render={props => {
      return (
        <LayoutComponent>
          <Component {...props} {...rest} />
        </LayoutComponent>
      )
    }}
  />
)

export default PublicRoute
