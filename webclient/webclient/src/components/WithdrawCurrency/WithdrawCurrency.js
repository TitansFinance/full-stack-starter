import React, { useState } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { compose, graphql, Mutation } from 'react-apollo'
import { pathOr, path } from 'ramda'
import gql from 'graphql-tag'
import { FlagIcon } from 'react-flag-kit'
import {
  MdCompareArrows,
  MdInput,
  MdUndo,
  MdSecurity,
  MdList,
  MdSettings,
  MdMailOutline,
  MdLibraryBooks,
  MdPeople,
} from 'react-icons/md'
import { FaQrcode } from 'react-icons/fa'
import getSymbolFromCurrency from 'currency-symbol-map'

import {
  withRequestPhoneVerificationCode,
} from '@/constructors/apollo/wrappers'

import * as camera from '@/utils/camera'
import {
  getValue,
  getValues,
  standardUnitFromBaseUnit,
  getErrorKey,
} from '@/utils'

import Card from '@/components/Card'
import Row from '@/components/Row'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Loading from '@/components/Loading'
import ChooseCurrency from '@/components/ChooseCurrency'
import CurrencyIcon from '@/components/CurrencyIcon'
import QRCodeScanner from '@/components/QRCodeScanner'

import './WithdrawCurrency.sass'


const WithdrawCurrency = withRequestPhoneVerificationCode(compose(
  graphql(gql`{
    me {
      id
      phone
      phoneCountryCode
      currency
      language
      accounts {
        balance
        currency {
          ticker
        }
      }
      wallets {
        type
        balance
      }
    }
    currentAverageExchangeRates(symbols: ["ETH/USDT", "BTC/USDT", "CNY/USD"]) {
      symbol
      rate
      numerator
      denominator
    }
  }`),
)(({
  data,
  className,
  currencyToWithdraw,
  requestPhoneVerificationCode,
}) => {
  if (data.loading) return <Loading />
  if (data.error) console.error(data.error)
  const { t } = useTranslation()
  const {
    me: {
      currency,
      accounts,
      phone,
      phoneCountryCode,
      language,
    },
    currentAverageExchangeRates,
  } = data
  const [sharesToSend, setSharesToSend] = useState('')
  const [fiatToSend, setFiatToSend] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [videoStream, setVideoStream] = useState('')
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('')
  const [codePhoneRequested, setCodePhoneRequested] = useState(false)

  const account = accounts.find(acct => acct.currency.ticker === currencyToWithdraw)
  if (!account) {
    return (
      <div className={cx({ WithdrawCurrency: true, [className]: Boolean(className) })}>
        {t('WithdrawCurrency.no-balance')}
      </div>
    )
  }
  const availableBalance = standardUnitFromBaseUnit(account.balance, currencyToWithdraw)
  const accountValue = getValue({
    rates: currentAverageExchangeRates,
    value: availableBalance,
    valueCurrency: currencyToWithdraw,
    targetCurrency: currency,
  })

  return (
    <div className={cx({ WithdrawCurrency: true, [className]: Boolean(className) })}>
      {videoStream ? <QRCodeScanner
        srcObject={videoStream}
        onResult={(r) => {
          setRecipientAddress(r)
          setVideoStream(null)
        }}
        onClose={() => setVideoStream(null)}
      /> : null}
      <Row className="WithdrawCurrencyHeader flex-center flex-column">
        <h3>{availableBalance} {currencyToWithdraw}</h3>
        <h4>{getSymbolFromCurrency(currency)} {accountValue.value.toFixed(2)}</h4>
      </Row>
      <Row className="WithdrawCurrencyAmount">
        <h4>{t('Amount')}</h4>
        <Row className="WithdrawCurrencyAmountSelect">
          <Input
            inline
            form
            type="text"
            placeholder={currencyToWithdraw}
            allowInputs={Input.allow.decimal}
            onChange={e => {
              console.log('Input BTC', e.target.value)
              if (e.target.value === '') {
                setSharesToSend('')
                setFiatToSend('')
                return
              }
              if (e.target.value === '.') {
                setSharesToSend('0.')
                setFiatToSend('')
                return
              }
              const newValue = parseFloat(e.target.value, 10) <= availableBalance ? e.target.value : availableBalance.toString()
              const { value } = getValue({
                rates: currentAverageExchangeRates,
                value: newValue,
                valueCurrency: currencyToWithdraw,
                targetCurrency: currency,
              })
              console.log(newValue, value)
              setSharesToSend(newValue || '')
              setFiatToSend(value.toString())
            }}
            value={sharesToSend || ''}
          />
          <MdCompareArrows />
          <Input
            inline
            form
            type="text"
            placeholder={currency}
            allowInputs={Input.allow.decimal}
            onChange={e => {
              console.log('Input USD value', e.target.value)
              if (e.target.value === '') {
                setSharesToSend('')
                setFiatToSend('')
                return
              }
              if (e.target.value === '.') {
                setSharesToSend('')
                setFiatToSend('0.')
                return
              }
              console.log(accountValue.value, e.target.value)
              const newValue = parseFloat(e.target.value, 10) < accountValue.value ? e.target.value : accountValue.value
              const { value } = getValue({
                rates: currentAverageExchangeRates,
                value: newValue,
                valueCurrency: currency,
                targetCurrency: currencyToWithdraw,
              })
              console.log(newValue, value)
              setSharesToSend(value.toString())
              setFiatToSend(newValue.toString())
            }}
            value={fiatToSend}
          />
        </Row>
      </Row>
      <Row className="Destination">
        <h4>{t('Destination')}</h4>
        <Row className="DestinationRecipient">
          <Input
            inline
            form
            type="text"
            placeholder={t('Recipient')}
            onChange={e => setRecipientAddress(e.target.value)}
            value={recipientAddress}
          >
            <FaQrcode
              className="InnerTextButton"
              onClick={async () => {
                console.log(camera)
                const { stream, error } = await camera.getMedia()
                if (stream) { setVideoStream(stream) }
              }}
            />
          </Input>
        </Row>
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
            {/*switch (getErrorKey(register.error)) {
              case 'errors.register.no-code':
                return t('RegisterForm.errors.register.no-code')
              case 'errors.register.incorrect-code':
                return t('RegisterForm.errors.register.incorrect-code')
              default:
                return null
            }*/}
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
              setCodePhoneRequested(true)
              document.querySelector('.PhoneVerificationCodeInput input').focus()
            }}
          >{t(`RegisterForm.${codePhoneRequested ? 'Resend' : 'Send'}`)}</span>
        </Input>
      </Row>
      <Mutation
        mutation={gql`
          mutation WithdrawCurrency(
            $ticker: String,
            $amount: String,
            $recipientAddress: String,
            $phoneVerificationCode: String,
          ) {
            withdrawCurrency(
              ticker: $ticker,
              amount: $amount,
              recipientAddress: $recipientAddress,
              phoneVerificationCode: $phoneVerificationCode,
            )
          }
        `}
        refetchQueries={({ data }) => {
          return [{
            query: gql`{
              me {
                id
                accounts { balance }
              }
            }`,
            cachePolicy: 'network-only',
          }]
        }}
        awaitRefetchQueries
      >
        {(mutation, info) => {
          if (info.error) console.error(info.error)
          return (
            <Button className="DoneButton" onClick={() => mutation({
              variables: {
                ticker: currencyToWithdraw.toString(),
                amount: sharesToSend.toString(),
                recipientAddress: recipientAddress.toString(),
                phoneVerificationCode,
              },
            })}>
              {info.loading ? <Loading className="ButtonLoading" /> : t('Send')}
            </Button>
          )
        }}
      </Mutation>
    </div>
  )
}))

const ChooseWithdrawCurrency = connect()(({
  dispatch,
  defaultSelected = 'BTC',
  className,
  ...rest
}) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(defaultSelected)
  return (
    <div className={cx({ ChooseWithdrawCurrency: true, [className]: Boolean(className) })}>
      <Card title={t('WITHDRAW')}>
        <ChooseCurrency
          currencyIconOnClick={({ currency }) => setSelected(currency.ticker)}
          selected={selected}
        />
        <WithdrawCurrency currencyToWithdraw={selected} />
      </Card>
    </div>
  )
})

export default ChooseWithdrawCurrency
