import React from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Loading from '@/components/Loading'
import { getValue } from '@/utils'


const CurrencyConverter = compose(
  graphql(gql`{
    currentAverageExchangeRates(symbols: ["ETH/USDT", "BTC/USDT", "CNY/USD", "USD/USD"]) {
      numerator
      denominator
      symbol
      rate
    }
    me {
      id
      currency
    }
  }`),
)(({
  data,
  value = null,
  valueCurrency,
  targetCurrency,
  addCurrencySign = true,
  addCurrencySymbol = false,
  decimals = 2,
  ...rest
}) => {
  if (data.error) console.error(error)
  if (data.loading) return <Loading />
  const floatValue = parseFloat(value, 10)
  if (typeof floatValue !== 'number') return null
  const rates = data.currentAverageExchangeRates
  const userCurrency = data.me.currency

  const converted = getValue({
    rates,
    value,
    valueCurrency,
    targetCurrency: (targetCurrency || userCurrency),
  })
  if (converted === null) return null
  return (
    <span {...rest}>
      {addCurrencySign ? converted.sign : null}{converted.value.toFixed(2)} {addCurrencySymbol ? converted.symbol : null}
    </span>
  )
})

CurrencyConverter.propTypes = {
  valueCurrency: PropTypes.string.isRequired,
}

export default CurrencyConverter
