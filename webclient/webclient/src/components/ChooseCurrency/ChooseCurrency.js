import React, { useState } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { path } from 'ramda'

import CurrencyIcon from '@/components/CurrencyIcon'
import Loading from '@/components/Loading'
import './ChooseCurrency.sass'


const CurrencyIconWithLabel = ({
  className,
  children = null,
  ticker,
  label = false,
  selected = null,
  ...rest
}) => {
  return (
    <div className={cx({ CurrencyIconWithLabel: true, selected, [className]: Boolean(className) })} {...rest}>
      <CurrencyIcon ticker={ticker} />
      <label>{ticker}</label>
    </div>
  )
}


const ChooseCurrency = ({
  data,
  dispatch,
  currencyIconOnClick,
  onClick,
  className,
  selected = null,
  ...rest
}) => {
  if (data.loading) return <Loading />
  if (data.error) console.error(data.error)
  const { currencies } = data
  return (
    <div className="ChooseCurrency">
      <div className={cx({ ChooseCurrencyIconList: true, [className]: Boolean(className) })} {...rest}>
        {currencies.map((currency, i) => {
          return (
            <CurrencyIconWithLabel
              key={i}
              label
              ticker={currency.ticker}
              selected={currency.ticker === selected}
              onClick={() => currencyIconOnClick({ currency })}
            />
          )
        })}
      </div>
    </div>
  )
}

export default connect(
  state => ({
    modal: state.modal,
  })
)(
  compose(
    graphql(gql`{
      currencies {
        ticker
      }
    }`),
  )(ChooseCurrency))
