import React, { useState, useRef, Suspense } from 'react'
import * as log from 'loglevel'
import cx from 'classnames'
import { withRouter } from 'react-router-dom'
import { Query, Mutation, graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import keycode from 'keycode'
import { useTranslation } from 'react-i18next'
import { FlagIcon } from 'react-flag-kit'

import axios from '@/constructors/axios'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Link from '@/components/Link'
import Row from '@/components/Row'
import Checkbox from '@/components/Checkbox'
import Loading from '@/components/Loading'

import { getErrorKey } from '@/utils'
import {
  withRequestEmailVerificationCode,
  withRequestPhoneVerificationCode,
} from '@/constructors/apollo/wrappers'

import './RegisterForm.sass'


const withRegister = Component => {
  return props => (
    <Mutation
      mutation={gql`
        mutation Register(
          $email: String
          $emailVerificationCode: String
          $password: String
          $phone: String
          $phoneVerificationCode: String
        ) {
          register(
            email: $email
            emailVerificationCode: $emailVerificationCode
            password: $password
            phone: $phone
            phoneVerificationCode: $phoneVerificationCode
            userType: "USER"
          ) {
            user {
              email
              emailVerified
              phone
              phoneVerified
            }
            tokenData { accessToken }
          }
        }
      `}
      refetchQueries={({ data }) => {
        const { accessToken, tokenType } = data.register.tokenData
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common['authorization'] = `${tokenType} ${accessToken}`
        return [{
          query: gql`{
            me {
              id
              email
              emailVerified
              phone
              phoneVerified
            }
          }`,
          cachePolicy: 'network-only',
        }]
      }}
      awaitRefetchQueries
    >
      {(mutation, info) => {
        return (
          <Component
            register={{ mutation, ...info }}
            {...props}
          />
        )
      }}
    </Mutation>
  )
}


const RegisterForm = ({
  history,
  requestPhoneVerificationCode,
  requestEmailVerificationCode,
  register,
  data,
}) => {
  if (data.error) console.error(data.error)
  if (data.loading) return <Loading />
  const { supportedLanguages } = data
  const { t, i18n } = useTranslation()
  const changeLanguage = lng => i18n.changeLanguage(lng)
  const form = useRef(null)
  const [codeEmailRequested, setCodeEmailRequested] = useState(false)
  const [codePhoneRequested, setCodePhoneRequested] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState(1)
  const [emailVerificationCode, setEmailVerificationCode] = useState('')
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('')
  const [password, setPassword] = useState('')

  const language = i18n.language.match(/en/ig) ? 'en' : 'zh'

  const action = async () => {
    await register.mutation({
      variables: {
        email: email.slice().toLowerCase(),
        phone: phone.slice().toLowerCase(),
        phoneCountryCode,
        password,
        emailVerificationCode,
        phoneVerificationCode,
        language,
      },
    })
    history.replace('/')
  }

  return (
    <Suspense fallback={<Loading />}>
      <div ref={form} className="Form RegisterForm" onKeyUp={e => {
        if (keycode.isEventKey(e, 'enter')) action()
      }}>
        <Logo />
        <Row>
          <Input
            form
            name="email"
            autoComplete="email"
            type="text"
            placeholder={`${t('Email')}`}
            onChange={e => setEmail(e.target.value)}
            value={email}
            errorMessage={() => {
              switch (getErrorKey(requestEmailVerificationCode.error) || getErrorKey(register.error)) {
                case 'errors.register.identifier-required':
                  return t('RegisterForm.errors.register.identifier-required')
                case 'errors.register.user-exists':
                  return t('RegisterForm.errors.register.user-exists')
                case 'errors.requestEmailVerificationCode.no-email':
                  return t('RegisterForm.errors.requestEmailVerificationCode.no-email')
                case 'errors.network.generic':
                  return 'No network connection.'
                default:
                  return null
              }
            }}
          />
        </Row>
        <Row>
          <Input
            form
            type="text"
            autoComplete="off"
            className="EmailVerificationCodeInput"
            placeholder={t('Code')}
            onChange={e => setEmailVerificationCode(e.target.value.slice(0, 6).toUpperCase())}
            value={emailVerificationCode}
            errorMessage={() => {
              switch (getErrorKey(register.error)) {
                case 'errors.register.no-code':
                  return t('RegisterForm.errors.register.no-code')
                case 'errors.register.incorrect-code':
                  return t('RegisterForm.errors.register.incorrect-code')
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
            >{t(`RegisterForm.${codeEmailRequested ? 'Resend' : 'Send\ email'}`)}</span>
          </Input>
        </Row>
        <Row className="RegisterPhoneInput">
          <select
            name="phone-country-code"
            autoComplete="phone-country-code"
            onChange={e => setPhoneCountryCode(e.target.value)}
            value={phoneCountryCode}
          >
            <option value="1">+ 1</option>
            <option value="86">+ 86</option>
          </select>
          <Input
            form
            name="phone"
            autoComplete="phone"
            type="text"
            placeholder={`${t('Phone')}`}
            onChange={e => setPhone(e.target.value)}
            value={phone}
            errorMessage={() => {
              switch (getErrorKey(requestPhoneVerificationCode.error) || getErrorKey(register.error)) {
                case 'errors.register.identifier-required':
                  return t('RegisterForm.errors.register.identifier-required')
                case 'errors.register.user-exists':
                  return t('RegisterForm.errors.register.user-exists')
                case 'errors.requestPhoneVerificationCode.no-phone':
                  return t('RegisterForm.errors.requestPhoneVerificationCode.no-phone')
                case 'errors.network.generic':
                  return 'No network connection.'
                default:
                  return null
              }
            }}
          />
        </Row>
        <Row>
          <Input
            form
            type="text"
            autoComplete="off"
            className="PhoneVerificationCodeInput"
            placeholder={t('Code')}
            onChange={e => setPhoneVerificationCode(e.target.value.slice(0, 6).toUpperCase())}
            value={phoneVerificationCode}
            errorMessage={() => {
              switch (getErrorKey(register.error)) {
                case 'errors.register.no-code':
                  return t('RegisterForm.errors.register.no-code')
                case 'errors.register.incorrect-code':
                  return t('RegisterForm.errors.register.incorrect-code')
                default:
                  return null
              }
            }}
          >
            <span
              className="InnerTextButton"
              onClick={async () => {
                await requestPhoneVerificationCode.mutation({ variables: {
                  phone,
                  phoneCountryCode,
                  language,
                } })
                setCodePhoneRequested(true)
                form.current.querySelector('.PhoneVerificationCodeInput input').focus()
              }}
            >{t(`RegisterForm.${codePhoneRequested ? 'Resend' : 'Send\ text'}`)}</span>
          </Input>
        </Row>
        <Row>
          <Input
            form
            name="password"
            autoComplete="off"
            type={'password'}
            placeholder={t('Password')}
            onChange={e => setPassword(e.target.value)}
            value={password}
            errorMessage={() => {
              switch (getErrorKey(register.error)) {
                case 'errors.register.password-required':
                  return t('RegisterForm.errors.register.password-required')
                case 'errors.register.invalid-password':
                  return t('RegisterForm.errors.register.invalid-password')
                default:
                  return null
              }
            }}
          />
        </Row>
        <Button
          children={t('RegisterForm.Create\ Wallet')}
          className="FormButton SignInButton"
          onClick={action}
          disabled={false}
        />
        <div className="LanguageSelect">
          语言/language
          <div className="LanguageSelectButtons">
            <Button className={cx({ SettingsButton: true, ButtonSelected: i18n.language.match(/zh/ig) })}
              onClick={() => changeLanguage('zh')}
              children={supportedLanguages ? supportedLanguages.find(l => l.key === 'zh').name : '中文'}
            />
            <Button className={cx({ SettingsButton: true, ButtonSelected: i18n.language.match(/en/ig) })}
              onClick={() => changeLanguage('en')}
              children={supportedLanguages ? supportedLanguages.find(l => l.key === 'en').name : 'English'}
            />
          </div>
        </div>
      </div>
    </Suspense>
  )
}


export default compose(
  graphql(gql`{
    supportedLanguages
  }`)
)(withRouter(
  withRegister(
    withRequestEmailVerificationCode(
      withRequestPhoneVerificationCode(RegisterForm)
    )
  )
))
