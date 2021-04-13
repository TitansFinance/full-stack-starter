import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

export const withRequestEmailVerificationCode = Component => {
  return props => (
    <Mutation
      mutation={gql`
        mutation RequestEmailVerificationCode($email: String) {
          requestEmailVerificationCode(email: $email)
        }
      `}
    >
      {(mutation, info) => {
        return <Component requestEmailVerificationCode={{ mutation, ...info }} {...props} />
      }}
    </Mutation>
  )
}

export const withRequestPhoneVerificationCode = Component => {
  return props => (
    <Mutation
      mutation={gql`
        mutation RequestPhoneVerificationCode($phone: String, $phoneCountryCode: Int, $language: String) {
          requestPhoneVerificationCode(phone: $phone, phoneCountryCode: $phoneCountryCode, language: $language)
        }
      `}
    >
      {(mutation, info) => {
        return <Component requestPhoneVerificationCode={{ mutation, ...info }} {...props} />
      }}
    </Mutation>
  )
}

