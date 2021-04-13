import React, { useState }from 'react'
import { compose, graphql, Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import cx from 'classnames'
import ReactSelect from 'react-select'

import SettingsRow from '@/components/SettingsRow'
import Button from '@/components/Button'
import Loading from '@/components/Loading'

import './UserSettingsSecurityPage.sass'

const UserSettingsSecurityPage = ({ data }) => {
  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const {
    me,
  } = data

  const {
    security,
  } = me

  return (
    <div className="Page PageSettings UserSettingsSecurityPage">
      <Mutation
        mutation={gql`
          mutation UpdateMe($input: UserInput) {
            updateMe(input: $input) {
              security
            }
          }
        `}
        refetchQueries={({ data }) => {
          return [{
            query: gql`{
              me {
                id
                language
                currency
              }
            }`,
          }]
        }}
      >
        {(mutate, { error, loading }) => {
          return (
            <>
              <SettingsRow title={'Verification'} className="CurrencySettingsRow">
              </SettingsRow>
              <SettingsRow title={'MFA'}>
              </SettingsRow>
              <SettingsRow title={'Biometrics'}>
              </SettingsRow>
              <SettingsRow title={'Transaction Lock'}>
              </SettingsRow>
            </>
          )
        }}
      </Mutation>
    </div>
  )
}

export default compose(
  graphql(gql`{
    me {
      id
      security
    }
  }`)
)(UserSettingsSecurityPage)
