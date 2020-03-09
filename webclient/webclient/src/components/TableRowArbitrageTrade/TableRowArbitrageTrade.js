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
import './TableRowArbitrageTrade.sass'


const getCost = order => {
  if (order.status === 'open') return null
  if (order.cost === undefined) return (parseFloat(order.price) * parseFloat(order.amount)).toFixed(4)
  return parseFloat(order.cost).toFixed(4)
}

const getCostText = cost => (typeof cost !== 'number' ? 'open' : cost.toFixed(8))

const TableRowArbitrageTrade = compose(
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
    buyOrder,
    sellOrder,
    buyOrderBook,
    sellOrderBook,
  } = item

  if (!buyOrder || !sellOrder) {
    return null
  }

  const sell = sellOrder.price * sellOrder.amount
  const buy = buyOrder.price * buyOrder.amount
  const spread = sell - buy
  const percentSpread = (sell - buy) / buyOrder.price * 100

  const { me: { currency } } = data
  return (
    <Suspense fallback={<Loading />}>
      <Table.Row className="TableRowArbitrageTrade" onClick={() => expandRow(!isExpanded)}>
        <div className="TableRowArbitrageTradeTop">
          <div className="flex-column flex-center" style={{ fontWeight: 'bold' }}>
            <div>{buyOrder.symbol}</div>
            <div>{'Price'}</div>
            <div>{'Avail. Size'}</div>
            <div>{'Fees'}</div>
            <div>{'Size Filled'}</div>
            <div>{'Cost'}</div>
            <div>{'Spread Made'}</div>
            <div>{'Timestamp'}</div>
          </div>
          <div className="flex-column flex-start">
            <div>{buyOrder.exchange || '--'} / {'BUY'}</div>
            <div>{parseFloat(buyOrder.price).toFixed(2)}</div>
            <div>{buyOrder.amount && parseFloat(buyOrder.amount).toFixed(6) || '--'}</div>
            <div>{buyOrder.filled && parseFloat(buyOrder.filled).toFixed(6) || '--'}</div>
            <div>{parseFloat(buyOrder.amount).toFixed(6)}</div>
            <div>{getCostText(getCost(buyOrder))}</div>
            <div><CurrencyConverter value={spread.toFixed(4)} valueCurrency={'USDT'} targetCurrency={currency} /></div>
            <div>{moment(new Date(parseInt(buyOrder.timestamp))).fromNow()}</div>
          </div>
          <div className="flex-column flex-start">
            <div>{sellOrder.exchange || '--'} / {'SELL'}</div>
            <div>{parseFloat(sellOrder.price).toFixed(2)}</div>
            <div>{sellOrder.amount && parseFloat(sellOrder.amount).toFixed(6) || '--'}</div>
            <div>{sellOrder.filled && parseFloat(sellOrder.filled).toFixed(6) || '--'}</div>
            <div>{parseFloat(sellOrder.amount).toFixed(6)}</div>
            <div>{getCostText(getCost(sellOrder))}</div>
            <div>{parseFloat(percentSpread).toFixed(4)}%</div>
            <div>{moment(new Date(parseInt(sellOrder.timestamp))).fromNow()}</div>
          </div>
        </div>
      </Table.Row>
    </Suspense>
  )
})

// <div className="flex-column flex-center">
//   <CurrencyIcon ticker={buyOrder.symbol.split('/')[0]} />
// </div>
//
// <div className="flex-column flex-center">
//   <span>{t('Fee\ Adjusted\ Spread')}</span>
//   <span><CurrencyConverter value={spread.toFixed(2)} valueCurrency={'USDT'} targetCurrency={currency} /></span>
//   <span>{percentSpread.toFixed(4)}%</span>
// </div>
// <div className="flex-column flex-center">
//   <div>{t('Exchanges')}</div>
//   <div>{sellOrder.exchange || '--'} / {buyOrder.exchange || '--'}</div>
//   <div className="TableRowArbitrageDate"><MdAccessTime /> <span>{moment(new Date(parseInt(buyOrder.timestamp))).fromNow()}</span></div>
// </div>


export default TableRowArbitrageTrade
