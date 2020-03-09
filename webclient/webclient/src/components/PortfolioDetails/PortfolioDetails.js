import React, { useState, useRef } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import cx from 'classnames'
import { withRouter } from 'react-router-dom'
import { path, pathOr } from 'ramda'
import {
  MdExpandLess,
  MdChevronRight,
} from 'react-icons/md'
import getSymbolFromCurrency from 'currency-symbol-map'
import { useTranslation } from 'react-i18next'

import PieChart from '@/components/PieChart'
import { getValue, getValues, standardUnitFromBaseUnit } from '@/utils'
import Loading from '@/components/Loading'


import './PortfolioDetails.sass'


const colors = ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'yellow']


const PortfolioDetailsIndividualFund = withRouter(({
  history,
  shares,
  name,
  ticker,
  value,
  color = 'blue',
}) => {
  const currencyIcon = 'currency-fund-generic@1x.png'
  console.log('ticker', ticker)
  return (
    <div className="PortfolioDetailsIndividualFund" onClick={() => {
      history.push({
        pathname: '/transactions',
        state: { ticker },
      })
    }}>
      <div className="PortfolioDetailsIndividualFundItems" style={{ borderLeft: `5px solid ${color}`}}>
        <img className="PortfolioDetailsIndividualFundIcon" src={process.env.GATEWAY_URL + `/static/images/tickers/${ticker}@2x.png`} alt="fund icon" />
        <div className="PortfolioDetailsIndividualFundValues">
          <div className="PortfolioDetailsIndividualFundValue">{value.sign} {value.value.toFixed(2)}</div>
          <div className="PortfolioDetailsIndividualFundAmount">{name} {parseFloat(standardUnitFromBaseUnit(shares, ticker), 10).toFixed(2)}</div>
        </div>
        <MdChevronRight style={{ fontSize: '2em', color: 'gray' }} />
      </div>
    </div>
  )
})

const PortfolioDetailsMyPortfolios = graphql(gql`{
  me {
    id
    currency
    accounts {
      balance
      currency { name, ticker }
    }
    portfolios {
      balance
      fund { name ticker }
    }
  }
  currentAverageExchangeRates(symbols: ["ETH/USDT", "BTC/USDT", "CNY/USD", "USD/USD"]) {
    numerator
    denominator
    symbol
    rate
  }
}`)(({ data }) => {
  if (data.error) console.error(data.error)
  if (data.loading) return <Loading />
  const { me: { accounts, portfolios, currency }, currentAverageExchangeRates } = data

  return (
    <div className="PortfolioDetailsMyPortfolios">
      {portfolios.map(({ balance, name, shares, ticker }, i) => {
        return (
          <PortfolioDetailsIndividualFund
            key={i}
            name={name}
            ticker={ticker}
            shares={balance}
            value={getValue({
              rates: currentAverageExchangeRates,
              value: standardUnitFromBaseUnit(balance, ticker),
              valueCurrency: ticker,
              targetCurrency: currency,
            })}
            color={colors[i % colors.length]}
          />
        )
      })}
      {accounts.map(({ balance, currency: { name, ticker } }, i) => (
        <PortfolioDetailsIndividualFund
          key={i}
          name={name}
          ticker={ticker}
          shares={balance}
          value={getValue({
            rates: currentAverageExchangeRates,
            value: standardUnitFromBaseUnit(balance, ticker),
            valueCurrency: ticker,
            targetCurrency: currency,
          })}
          color={colors[i % colors.length]}
        />
      ))}
    </div>
  )
})


const PortfolioPieChart = graphql(gql`{
    me {
      id
      currency
      accounts { balance currency { ticker } }
      portfolios { balance fund { name ticker } }
    }
    currentAverageExchangeRates(symbols: ["ETH/USDT", "BTC/USDT", "CNY/USD", "USD/USD"]) {
      numerator
      denominator
      symbol
      rate
    }
  }`)(({ value, data }) => {
  if (data.error) console.error(data.error)
  if (data.loading) return <Loading />
  const { me, currentAverageExchangeRates } = data
  const { currency, accounts, portfolios } = me
  const { t } = useTranslation()

  const portfolioValue = getValues({
    rates: currentAverageExchangeRates,
    values: portfolios,
    targetCurrency: currency,
  })

  const accountValue = getValues({
    rates: currentAverageExchangeRates,
    values: accounts,
    targetCurrency: currency,
  })


  const totalValue = (portfolioValue + accountValue) || 0

  const slices = portfolios.concat(accounts).map(({ balance, currency, fund }, i) => {
    const ticker = pathOr(path(['ticker'], currency), ['ticker'], fund)
    const { value } = getValue({
      rates: currentAverageExchangeRates,
      value: standardUnitFromBaseUnit(balance, ticker),
      valueCurrency: ticker,
      targetCurrency: me.currency,
    })
    return {
      name: ticker,
      percentage: (value / totalValue * 100),
      color: colors[i % colors.length],
    }
  })

  return (
    <PieChart slices={slices}>
      <g className="circle-chart__info">
        <text className="circle-chart__percent" x="17.91549431" y="15" alignmentBaseline="central" textAnchor="middle" fontSize="4">{getSymbolFromCurrency(data.me.currency)} {totalValue.toFixed(2)}</text>
        <text className="circle-chart__subline" x="17.91549431" y="21.5" alignmentBaseline="central" textAnchor="middle" fontSize="3">{t('BALANCE')}</text>
      </g>
    </PieChart>
  )
})


const PortfolioDetails = ({
  open = true,
  collapsible = false,
  accounts = [],
  portfolios = [],
  onCollapse = () => ({}),
}) => {
  if (!open) return null
  return (
    <div className="PortfolioDetails">
      <PortfolioPieChart />
      <PortfolioDetailsMyPortfolios portfolios={portfolios} accounts={accounts} />
      {collapsible ? (
        <div className="PortfolioDetailsBottom">
          <MdExpandLess onClick={() => onCollapse()} />
        </div>
      ) : null}
    </div>
  )
}

export default PortfolioDetails
