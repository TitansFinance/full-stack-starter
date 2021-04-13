import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { path, pathOr } from 'ramda'

import './CurrentUserHandle.sass'

const CurrentUserHandle = compose(
  graphql(gql`{
    me {
      id
      username
    }
  }`),
)(({ data }) => {
  return <div className="CurrentUserHandle">
    @{path(['me', 'username'], data)}
  </div>
})

export default CurrentUserHandle
