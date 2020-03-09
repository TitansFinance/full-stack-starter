import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { compose, graphql, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import {
  MdCompareArrows,
} from 'react-icons/md'
import { Select, Radio } from 'antd'

import {
  getValue,
  getValues,
  standardUnitFromBaseUnit,
  getErrorKey,
  convertCurrency,
  calculateSimpleLoanInterest,
} from '@/utils'

import Card from '@/components/Card'
import Row from '@/components/Row'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Loading from '@/components/Loading'
import ChooseCurrency from '@/components/ChooseCurrency'
import CurrencyConverter from '@/components/CurrencyConverter'

import './LoanCalculatorPage.sass'


const RequestLoan = compose(
  graphql(gql`{
    me {
      id
      currency
      accounts {
        balance
        currency {
          ticker
        }
      }
    }
    currentAverageExchangeRates(symbols: ["ETH/USDT", "BTC/USDT", "CNY/USD"]) {
      symbol
      rate
      numerator
      denominator
    }
    loanDetailsByCurrency {
      ticker
      maxLoanValueUSD
      ltv
      interestRate
    }
  }`),
)(({
  data,
  className,
  currencyToLoan,
}) => {
  if (data.loading) return <Loading />
  if (data.error) console.error(data.error)
  const { t } = useTranslation()
  const {
    me: {
      currency,
      accounts,
    },
    currentAverageExchangeRates,
    loanDetailsByCurrency,
  } = data
  const [sharesToLoan, setSharesToLoan] = useState('')
  const [fiatToLoan, setFiatToLoan] = useState('')
  const [loanPeriod, setLoanPeriod] = useState('day')

  useEffect(() => {
    console.log({
      rates: currentAverageExchangeRates,
      value: fiatToLoan,
      valueCurrency: currency,
      targetCurrency: currencyToLoan,
    })
    if (!fiatToLoan) return
    const { value } = getValue({
      rates: currentAverageExchangeRates,
      value: fiatToLoan,
      valueCurrency: currency,
      targetCurrency: currencyToLoan,
    })
    console.log('value: ', value)
    setSharesToLoan(value.toString())
  }, [currencyToLoan])

  const loanDetails = loanDetailsByCurrency.find(l => l.ticker === currencyToLoan)
  const maxLoanValueUSD = loanDetails.maxLoanValueUSD
  const maxLoanValueShares = convertCurrency(currentAverageExchangeRates, maxLoanValueUSD, 'USD', currencyToLoan)
  const maxLoanValueUserCurrency = convertCurrency(currentAverageExchangeRates, maxLoanValueUSD, 'USD', currency)

  const interestPerPeriod = calculateSimpleLoanInterest({
    principle: fiatToLoan,
    duration: loanPeriod,
    interestRate: loanDetails.interestRate,
  })

  return (
    <div className={cx({ RequestLoan: true, [className]: Boolean(className) })}>
      <Row className="RequestLoanAmount">
        <h4>{t('Amount')}</h4>
        <Row className="RequestLoanAmountSelect">
          <Input
            inline
            form
            type="text"
            placeholder={currencyToLoan}
            allowInputs={Input.allow.decimal}
            onChange={e => {
              console.log('Input BTC', e.target.value)
              if (e.target.value === '') {
                setSharesToLoan('')
                setFiatToLoan('')
                return
              }
              if (e.target.value === '.') {
                setSharesToLoan('0.')
                setFiatToLoan('')
                return
              }
              const newValue = parseFloat(e.target.value, 10) <= maxLoanValueShares ? e.target.value : maxLoanValueShares.toString()
              const { value } = getValue({
                rates: currentAverageExchangeRates,
                value: newValue,
                valueCurrency: currencyToLoan,
                targetCurrency: currency,
              })
              console.log(newValue, value)
              setSharesToLoan(newValue || '')
              setFiatToLoan(value.toString())
            }}
            value={sharesToLoan || ''}
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
                setSharesToLoan('')
                setFiatToLoan('')
                return
              }
              if (e.target.value === '.') {
                setSharesToLoan('')
                setFiatToLoan('0.')
                return
              }
              console.log(maxLoanValueUserCurrency, e.target.value)
              const newValue = parseFloat(e.target.value, 10) < maxLoanValueUserCurrency ? e.target.value : maxLoanValueUserCurrency
              const { value } = getValue({
                rates: currentAverageExchangeRates,
                value: newValue,
                valueCurrency: currency,
                targetCurrency: currencyToLoan,
              })
              console.log(newValue, value)
              setSharesToLoan(value.toString())
              setFiatToLoan(newValue.toString())
            }}
            value={fiatToLoan}
          />
        </Row>
      </Row>
      <Row style={{ flexDirection: 'column' }}>
        <Row style={{ fontWeight: 600 }}>
          {t('LoanCalculatorPage.InterestTemplate', { rate: loanDetails.interestRate * 100, duration: t(loanPeriod) })}
        </Row>
        <Row style={{ fontSize: '0.9em' }}>
          {t('LoanCalculatorPage.NoMinimum')}
        </Row>
        <Row style={{ padding: '10px 0' }}>
          <CurrencyConverter
            valueCurrency={currency}
            targetCurrency={currency}
            value={interestPerPeriod}
          />
        </Row>
        <Row>
          <Radio.Group value={loanPeriod} onChange={(e) => setLoanPeriod(e.target.value)}>
            <Radio.Button value="day">{t('Daily')}</Radio.Button>
            <Radio.Button value="month">{t('Monthly')}</Radio.Button>
            <Radio.Button value="year">{t('Yearly')}</Radio.Button>
          </Radio.Group>
        </Row>
      </Row>
      {/*<Mutation
        mutation={gql`
          mutation RequestLoan(
            $ticker: String,
            $amount: String,
          ) {
            withdrawCurrency(
              ticker: $ticker,
              amount: $amount,
            )
          }
        `}
      >
        {(mutation, info) => {
          if (info.error) console.error(info.error)
          return (
            <Button className="DoneButton" onClick={() => mutation({
              variables: {
                ticker: currencyToLoan.toString(),
                amount: sharesToLoan.toString(),
              },
            })}>
              {info.loading ? <Loading className="ButtonLoading" /> : t('Request')}
            </Button>
          )
        }}
      </Mutation>*/}
    </div>
  )
})


const LoanCalculatorPage = ({}) => {
  document.title = 'WalletAppTitle - Settings'
  const { t } = useTranslation()
  const [selected, setSelected] = useState('BTC')

  return (
    <div className="Page LoanCalculatorPage">
      <Card title={t('LoanCalculatorPage.Choose\ a\ crypto\ asset')}>
        <ChooseCurrency
          currencyIconOnClick={({ currency }) => setSelected(currency.ticker)}
          selected={selected}
        />
        <RequestLoan currencyToLoan={selected} />
      </Card>
    </div>
  )
}

export default LoanCalculatorPage
