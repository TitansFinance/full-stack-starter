import React, { useState } from 'react'
import cx from 'classnames'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FlagIcon } from 'react-flag-kit'
import {
  MdExpandMore,
} from 'react-icons/md'
import getSymbolFromCurrency from 'currency-symbol-map'

import Card from '@/components/Card'
import CurrentUserImage from '@/components/CurrentUserImage'
import CurrentUserHandle from '@/components/CurrentUserHandle'
import PortfolioDetails from '@/components/PortfolioDetails'
import Loading from '@/components/Loading'

import { getValue, getValues } from '@/utils'

import './PortfolioSnapshot.sass'

const countryCodeForCurrency = (currency) => {
  switch (currency) {
    case 'USD':
      return 'US'
    case 'CNY':
      return 'CN'
    default:
      return 'US'
  }
}

const PortfolioSnapshotValue = ({ value, currency, className }) => {
  return (
    <div className={cx({ PortfolioSnapshotValue: true, [className]: true })}>
      <div className="PortfolioSnapshotValueBalance">
        <span>{getSymbolFromCurrency(currency)} {value}</span>
        <FlagIcon code={countryCodeForCurrency(currency)} size={18} />
      </div>
    </div>
  )
}

const PortfolioSnapshot = compose(
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
      portfolios {
        balance
        fund {
          name
        }
      }
    }
    currentAverageExchangeRates(symbols: ["ETH/USDT", "BTC/USDT", "CNY/USD", "USD/USD"]) {
      numerator
      denominator
      symbol
      rate
    }
  }`),
)(({ data, onClick, expandable, defaultExpanded = null }) => {
  if (data.error) console.error(error)
  if (data.loading) return <Loading size={8} />

  const { me } = data
  const { username, portfolios, accounts } = me
  const rates = data.currentAverageExchangeRates

  const portfolioValue = getValues({
    rates,
    values: portfolios,
    targetCurrency: me.currency,
  })
  const accountValue = getValues({
    rates,
    values: accounts,
    targetCurrency: me.currency,
  })

  const totalValue = (portfolioValue + accountValue).toFixed(2)

  const [expanded, setExpanded] = useState(defaultExpanded != null ? defaultExpanded : Boolean(totalValue > 0))
  let conditionalSection = null
  if (expandable) {
    if (expanded) {
      conditionalSection = <PortfolioDetails
        open={expanded}
        collapsible
        portfolios={portfolios}
        accounts={accounts}
        onCollapse={() => setExpanded(false)}
        currency={me.currency}
      />
    } else {
      conditionalSection = <div className="ShowDetailsButton" onClick={() => setExpanded(true)}><MdExpandMore /></div>
    }
  }

  return (
    <div className="PortfolioSnapshot">
      <Card className="PortfolioSnapshotCard" onClick={onClick || (() => {})}>
        <div className="PortfolioSnapshotTop">
          <div className="PortfolioSnapshotTopLeft">
            <CurrentUserImage />
            <CurrentUserHandle />
          </div>
          <PortfolioSnapshotValue
            className="PortfolioSnapshotTopRight"
            value={totalValue}
            currency={me.currency}
          />
        </div>
        {/*<div className="PortfolioSnapshotBottom">
          <div className="PortfolioSnapshotValueYTD">YTD: <div>+ {'0'}%</div></div>
        </div>*/}
      </Card>
      {conditionalSection}
    </div>
  )
})

export default PortfolioSnapshot
