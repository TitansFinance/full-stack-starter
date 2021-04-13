

import React, { Suspense } from 'react'
import cx from 'classnames'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FlagIcon } from 'react-flag-kit'
import {
  MdAccessTime,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import moment from '@/constructors/moment'
import web3 from '@/constructors/web3'
import CurrencyConverter from '@/components/CurrencyConverter'
import CurrencyIcon from '@/components/CurrencyIcon'
import Table from '@/components/Table'
import Row from '@/components/Row'
import Loading from '@/components/Loading'
import {
  standardUnitFromBaseUnit,
  capitalize,
  tickerIsERC20,
  userWalletForCurrency,
  shortAddress,
} from '@/utils'

import './TableRowArbitrageOpportunity.sass'


const TableRowArbitrageOpportunity = compose(
  graphql(gql`{
    me {
      id
      currency
    }
  }`)
)(({ data, index, item, isExpanded, expandRow }) => {
  if (data.error) console.error(data.error)
  if (data.loading) return null
  const { t, i18n } = useTranslation()
  const {
    symbol,
    date,
    spread,
    rawSpread,
    numerator,
    denominator,
    exchangePair,
    fees,
    percentSpread,
    bidExchange,
    askExchange,
    bidOrder,
    askOrder,
    buyPrice,
    sellPrice,
    buyQuantity,
    sellQuantity,
    buyExchange,
    sellExchange,
  } = item

  const { me: { currency } } = data
  return (
    <Suspense fallback={<Loading />}>
      <Table.Row className="TableRowArbitrageOpportunity" onClick={() => expandRow(!isExpanded)}>
        <div className="TableRowArbitrageOpportunityTop">
          <div className="flex-column flex-center">
            <CurrencyIcon ticker={symbol.split('/')[0]} />
          </div>
          <div className="flex-column flex-center">
            <span>{t('Fee\ Adjusted\ Spread')}</span>
            <span><CurrencyConverter value={spread.toFixed(2)} valueCurrency={'USDT'} targetCurrency={currency} /></span>
            <span>{percentSpread.toFixed(2)}%</span>
          </div>
          <div className="flex-column flex-center">
            {t('Buy')}
            <span>{buyExchange || '--'}</span>
            <CurrencyConverter value={buyPrice} valueCurrency={'USDT'} targetCurrency={currency} />
            {parseFloat(buyQuantity).toFixed(2)}
          </div>
          <div className="flex-column flex-center">
            {t('Sell')}
            <span>{sellExchange || '--'}</span>
            <CurrencyConverter value={sellPrice} valueCurrency={'USDT'} targetCurrency={currency} />
            {parseFloat(sellQuantity).toFixed(2)}
          </div>
        </div>
        <div className="TableRowArbitrageOpportunityDate"><MdAccessTime /> <span>{moment(new Date(parseInt(date))).fromNow()}</span></div>
        <div>{t('Fees')}: <CurrencyConverter value={fees.toFixed(2)} valueCurrency={'USDT'} targetCurrency={currency} /></div>
      </Table.Row>
    </Suspense>
  )
})


export default TableRowArbitrageOpportunity
