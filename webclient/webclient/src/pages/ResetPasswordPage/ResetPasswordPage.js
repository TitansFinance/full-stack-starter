import React, { useState, useRef } from 'react'
import * as log from 'loglevel'
import { withRouter } from 'react-router-dom'
import { compose, graphql, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useTranslation } from 'react-i18next'
// import { equals } from 'ramda'

import apollo from '@/constructors/apollo'
import { withRequestEmailVerificationCode } from '@/constructors/apollo/wrappers'
import LoadingPage from '@/pages/LoadingPage'
import Logo from '@/components/Logo'
import Input from '@/components/Input'
import EditInput from '@/components/EditInput'
import Button from '@/components/Button'
import Row from '@/components/Row'
import { getErrorKey } from '@/utils'

// import UpdatePasswordForm from '@/components/UpdatePasswordForm'
// import './UpdatePasswordForm.sass'
import './ResetPasswordPage.sass'


const ResetPasswordForm = withRouter(withRequestEmailVerificationCode(({
  requestEmailVerificationCode,
  history,
}) => {
  const form = useRef(null)
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [emailVerificationCode, setEmailVerificationCode] = useState('')
  const [codeEmailRequested, setCodeEmailRequested] = useState(false)
  const [hasChangedSuccessfuly, setHasChangedSuccessfully] = useState(false)

  const passwordFormIsValid = (
    newPassword
    && confirmNewPassword
    && emailVerificationCode
  )

  return (
    <div className="ResetPasswordForm" ref={form}>
      <Mutation
        mutation={gql`
          mutation ResetPassword(
            $identifier: String!,
            $code: String!,
            $password: String!
          ) {
            resetPassword(
              identifier: $identifier,
              code: $code,
              password: $password
            )
          }
        `}
      >
        {(resetPassword, { data, error, loading }) => {
          return (
            <>
              <Row>
                <Input
                  form
                  type="email"
                  placeholder={t('Email')}
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  className="UserSettingsEditInputNewPassword"
                  allowInputs={Input.allow.email}
                />
              </Row>
              <Row>
                <Input
                  form
                  type="text"
                  className="EmailVerificationCodeInput"
                  placeholder={t('Code')}
                  onChange={e => setEmailVerificationCode(e.target.value.slice(0, 6).toUpperCase())}
                  value={emailVerificationCode}
                  errorMessage={() => {
                    switch (getErrorKey(resetPassword.error)) {
                      case 'errors.resetPassword.no-code':
                        return t('RegisterForm.errors.resetPassword.no-code')
                      case 'errors.resetPassword.incorrect-code':
                        return t('RegisterForm.errors.resetPassword.incorrect-code')
                      default:
                        return null
                    }
                  }}
                >
                  <span
                    className="InnerTextButton"
                    onClick={async () => {
                      await requestEmailVerificationCode.mutation({ variables: { email } })
                      setCodeEmailRequested(true)
                      form.current.querySelector('.EmailVerificationCodeInput input').focus()
                    }}
                  >{t(`RegisterForm.${codeEmailRequested ? 'Resend' : 'Send'}`)}</span>
                </Input>
              </Row>
              <Row>
                <Input
                  form
                  type="password"
                  placeholder={t('New\ Password')}
                  onChange={e => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="UserSettingsEditInputNewPassword"
                  allowInputs={Input.allow.password}
                />
              </Row>
              <Row>
                <Input
                  form
                  type="password"
                  placeholder={t('Confirm\ Password')}
                  allowInputs={Input.allow.password}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  value={confirmNewPassword}
                />
              </Row>
              <Row>
                <Button
                  disabled={!passwordFormIsValid}
                  onClick={async () => {
                    if (!passwordFormIsValid) return
                    const { data } = await resetPassword({
                      variables: {
                        code: emailVerificationCode,
                        identifier: email,
                        password: newPassword,
                      },
                    })
                    setHasChangedSuccessfully(true)
                    console.log('redirect')
                    history.push('/login')
                  }}
                  className="DoneButton"
                  children={t('Change\ Password')}
                />
              </Row>
            </>
          )
        }}
      </Mutation>
    </div>
  )
}))


const ResetPasswordPage = withRouter(({ history }) => {
  document.title = 'Wallet - Reset Password'
  return (
    <div className="ResetPasswordPage">
      <div className="Form ResetPasswordForm">
        <Logo />
        <ResetPasswordForm />
      </div>
    </div>
  )
})

export default ResetPasswordPage
