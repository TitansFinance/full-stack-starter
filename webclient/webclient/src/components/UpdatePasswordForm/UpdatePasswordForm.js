import React, { useState, useRef } from 'react'
import * as log from 'loglevel'
import { Link, withRouter } from 'react-router-dom'
import { compose, graphql, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useTranslation } from 'react-i18next'
import { MdEdit, MdSave, MdClose } from 'react-icons/md'
import { equals } from 'ramda'

import apollo from '@/constructors/apollo'
import { withRequestPhoneVerificationCode } from '@/constructors/apollo/wrappers'
import LoadingPage from '@/pages/LoadingPage'
import Input from '@/components/Input'
import EditInput from '@/components/EditInput'
import Button from '@/components/Button'
import Row from '@/components/Row'
import SettingsRow from '@/components/SettingsRow'
import CurrentUserImage from '@/components/CurrentUserImage'
import { getErrorKey } from '@/utils'

import './UpdatePasswordForm.sass'


const UpdatePasswordForm = compose(
  graphql(gql`{
    me {
      id
      email
      phone
      phoneCountryCode
      language
    }
  }`),
)(withRequestPhoneVerificationCode(({
  data,
  requestPhoneVerificationCode,
}) => {
  if (data.error) console.error(data.error)
  if (data.loading) return null
  const { me } = data
  const {
    phone,
    phoneCountryCode,
    language,
  } = me
  const form = useRef(null)
  const { t } = useTranslation()
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordEditMode, setPasswordEditMode] = useState(false)
  // const [emailVerificationCode, setEmailVerificationCode] = useState('')
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('')
  // const [codeEmailRequested, setCodeEmailRequested] = useState(false)
  const [codePhoneRequested, setCodePhoneRequested] = useState(false)
  const [hasChangedSuccessfuly, setHasChangedSuccessfully] = useState(false)

  const clear = () => {
    setNewPassword('')
    setConfirmNewPassword('')
    // setEmailVerificationCode('')
    setPhoneVerificationCode('')
    setPasswordEditMode(false)
  }

  const passwordFormIsValid = (
    newPassword
    && confirmNewPassword
    // && emailVerificationCode
    && phoneVerificationCode
  )

  return (
    <div className="UpdatePasswordForm" ref={form}>
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
              <SettingsRow title={t('Change\ Password')}
                actionButton={passwordEditMode ? <MdClose onClick={() => setPasswordEditMode(false)} /> : null}>

                <EditInput
                  type="password"
                  placeholder={t('New\ Password')}
                  onChange={e => {
                    setNewPassword(e.target.value)
                    setPasswordEditMode(Boolean(e.target.value))
                  }}
                  value={newPassword}
                  className="UserSettingsEditInputNewPassword"
                  editing={passwordEditMode}
                  allowInputs={Input.allow.password}
                  focusRoot={form.current}
                  onEdit={() => setPasswordEditMode(true)}
                />
              </SettingsRow>
              {passwordEditMode ? (
                <>
                  <Row>
                    <Input
                      form
                      type="password"
                      placeholder={t('Confirm\ Password')}
                      allowInputs={Input.allow.password}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      value={confirmNewPassword}
                      errorMessage={() => {
                        if (confirmNewPassword !== newPassword) return 'Password does not match'
                        return null
                      }}
                    />
                  </Row>
                  {/*<Row>
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
                  </Row>*/}
                  <Row>
                    <Input
                      form
                      type="text"
                      className="PhoneVerificationCodeInput"
                      placeholder={t('Code')}
                      onChange={e => setPhoneVerificationCode(e.target.value.slice(0, 6).toUpperCase())}
                      value={phoneVerificationCode}
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
                          await requestPhoneVerificationCode.mutation({
                            variables: {
                              phone,
                              phoneCountryCode,
                              language,
                            },
                          })
                          setCodeEmailRequested(true)
                          form.current.querySelector('.PhoneVerificationCodeInput input').focus()
                        }}
                      >{t(`RegisterForm.${codePhoneRequested ? 'Resend' : 'Send'}`)}</span>
                    </Input>
                  </Row>
                  <Row>
                    <Button
                      disabled={!passwordFormIsValid}
                      onClick={async () => {
                        if (!passwordFormIsValid) return
                        const { data } = await resetPassword({
                          variables: {
                            code: phoneVerificationCode,
                            identifier: email,
                            password: newPassword,
                          },
                        })
                        if (data.resetPassword) clear()
                        setHasChangedSuccessfully(true)
                      }}
                      className="DoneButton"
                      children={t('Change\ Password')}
                    />
                  </Row>
                  <Row className="flex-center">
                    <span className="background-text" onClick={() => clear()}>{t('Cancel')}</span>
                  </Row>
                </>
              ) : null}
            </>
          )
        }}
      </Mutation>
      {(hasChangedSuccessfuly && !passwordEditMode) ? (
        <div style={{ color: 'green', textAlign: 'center' }}>{t('Password\ Changed')}</div>
      ) : null}
    </div>
  )
}))

export default UpdatePasswordForm
