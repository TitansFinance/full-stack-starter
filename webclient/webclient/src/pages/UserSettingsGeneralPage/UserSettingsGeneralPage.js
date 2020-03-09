import React, { useState, Suspense }from 'react'
import { compose, graphql, Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import cx from 'classnames'
import ReactSelect from 'react-select'
import { useTranslation } from 'react-i18next'

import SettingsRow from '@/components/SettingsRow'
import Button from '@/components/Button'
import Loading from '@/components/Loading'

import './UserSettingsGeneralPage.sass'

const UserSettingsGeneralPage = ({ data }) => {
  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const { t, i18n } = useTranslation()
  const changeLanguage = lng => i18n.changeLanguage(lng)

  const {
    me,
    supportedLanguages,
  } = data

  const {
    language,
    currency,
    // notifications,
  } = me

  const ChangeCurrencyButton = ({ value, ...rest }) => (
    <Button
      className={cx({ SettingsButton: true, ButtonSelected: value === currency })}
      children={value}
      {...rest}
    />
  )
  return (
    <Suspense fallback={<div><Loading /></div>}>
      <div className="Page PageSettings UserSettingsGeneralPage">
        <Mutation
          mutation={gql`
            mutation UpdateMe($input: UserInput) {
              updateMe(input: $input) {
                language
                currency
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
                <SettingsRow title={t('UserSettingsGeneralPage.section-titles.0')} className="CurrencySettingsRow">
                  <ChangeCurrencyButton value="USD" onClick={() => mutate({ variables: { input: { currency: 'USD' } } })}>
                    $ USD
                  </ChangeCurrencyButton>
                  <ChangeCurrencyButton value="CNY" onClick={() => mutate({ variables: { input: { currency: 'CNY' } } })}>
                    ¥ CNY
                  </ChangeCurrencyButton>
                </SettingsRow>
                <SettingsRow title={t('UserSettingsGeneralPage.section-titles.1')}>
                  <ReactSelect
                    className="LanguageSelect"
                    value={{ value: language, label: supportedLanguages.find(l => l.key === language).name }}
                    onChange={selected => {
                      mutate({ variables: { input: { language: selected.value } } })
                      changeLanguage(selected.value)
                    }}
                    options={supportedLanguages.map(lang => ({
                      label: lang.name,
                      value: lang.key,
                    }))}
                  />
                </SettingsRow>
                <SettingsRow title={t('UserSettingsGeneralPage.section-titles.2')}>
                  {t('Coming\ Soon')}
                </SettingsRow>
              </>
            )
          }}
        </Mutation>
      </div>
    </Suspense>
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
)(UserSettingsGeneralPage)
