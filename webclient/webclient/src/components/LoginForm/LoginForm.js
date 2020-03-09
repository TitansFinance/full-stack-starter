import React, { useState, Suspense } from 'react'
import { path } from 'ramda'
import { compose, graphql, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import cx from 'classnames'
import * as log from 'loglevel'
import { withRouter } from 'react-router-dom'
import keycode from 'keycode'
import { useTranslation } from 'react-i18next'

import axios from '@/constructors/axios'
import localStorage from '@/constructors/localStorage'

import Logo from '@/components/Logo'
import Button from '@/components/Button'
import Link from '@/components/Link'
import Row from '@/components/Row'
import Input from '@/components/Input'
import Checkbox from '@/components/Checkbox'
import Loading from '@/components/Loading'

import { getErrorKey } from '@/utils'

import './LoginForm.sass'


const LoginForm = props => {
  const { history, data } = props
  if (data.error) console.error('error')
  if (data.loading) return <Loading />
  const { supportedLanguages } = data
  const { t, i18n } = useTranslation()
  const changeLanguage = lng => i18n.changeLanguage(lng)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [checked, setChecked] = useState(true)

  return (
    <Mutation
      mutation={gql`
        mutation Login(
          $identifier: String!
          $password: String!
        ) {
          login(
            identifier: $identifier,
            password: $password
          ) {
            user { username userType }
            tokenData { accessToken }
          }
        }
      `}
      refetchQueries={({ data }) => {
        const { accessToken, tokenType } = data.login.tokenData
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common['authorization'] = `${tokenType} ${accessToken}`
        return [{
          query: gql`{
            me { id username userType }
          }`,
          variables: {
            token: data.login.tokenData.accessToken,
          },
        }]
      }}
      awaitRefetchQueries
    >
      {(loginMutation, { data, error }) => {
        const login = async () => {
          const { data } = await loginMutation({
            variables: {
              identifier,
              password,
            },
          })
          history.replace('/')
        }
        return (
          <div className="Form LoginForm" onKeyUp={e => {
            if (keycode.isEventKey(e, 'enter')) login()
          }}>
            <Logo />
            <Row>
              <Input
                form
                type="text"
                placeholder={`${t('Email')}/${t('Phone')}`}
                onChange={e => setIdentifier(e.target.value)}
                value={identifier}
                errorMessage={() => t(getErrorKey(error))}
              />
            </Row>
            <Row>
              <Input
                form
                type={'password'}
                placeholder={t('Password')}
                onChange={e => setPassword(e.target.value)}
                value={password}
                errorMessage={() => t(getErrorKey(error))}
              />
            </Row>
            <Row className="RememberMeAndForgotPassword">
              <Checkbox after={t('LoginForm.Remember\ me')} checked={checked} onClick={() => setChecked(!checked)} />
              <Link to={'/resetpassword'}>{t('LoginForm.Forgot\ Password?')}</Link>
            </Row>
            <Button
              children={t('LoginForm.Sign\ in')}
              className="FormButton SignInButton"
              onClick={login}
            />
            <p className="TrailingLink">{t(`LoginForm.Don't have an account?`)} <Link to={'/register'}> {t('LoginForm.Sign\ up')}</Link></p>
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
        )
      }}
    </Mutation>
  )
}

export default compose(
  graphql(gql`{
    me {
      id
      language
      currency
    }
    supportedCurrencies
    supportedLanguages
  }`)
)(withRouter(LoginForm))
