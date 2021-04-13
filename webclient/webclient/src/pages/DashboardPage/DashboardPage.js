import React, { Component, useState, Suspense } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, graphql, Query, Subscription } from 'react-apollo'
import { pathOr, path } from 'ramda'
import gql from 'graphql-tag'
import cx from 'classnames'
import { FlagIcon } from 'react-flag-kit'
import {
  MdExpandMore,
  MdExpandLess,
  MdCheckCircle,
  MdArrowForward,
  MdMonetizationOn,
  MdInfoOutline,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { Row, Col } from 'antd'

import history from '@/constructors/history'

import Button from '@/components/Button'
import Table from '@/components/Table'
import Card from '@/components/Card'
import PortfolioSnapshot from '@/components/PortfolioSnapshot'
import RecentTransactions from '@/components/RecentTransactions'
import ArbitrageOpportunitiesTable from '@/components/ArbitrageOpportunitiesTable'
import ArbitrageTradesTable from '@/components/ArbitrageTradesTable'
import ExchangesTableWithData from '@/components/ExchangesTableWithData'
import ChooseDepositCurrency from '@/components/ChooseDepositCurrency'
import RebalancesTableWithData from '@/components/RebalancesTableWithData'
import FundsCarousel from '@/components/FundsCarousel'
import Loading from '@/components/Loading'
import FeatureFlag from '@/components/FeatureFlag'

import './DashboardPage.sass'


const withQuery = compose(
  graphql(gql`{
    me {
      id
      username
      email
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
      wallets {
        type
        balance
      }
      transactions(tickers: null, offset: 0, limit: 3) {
        id
        transaction { status }
        addressTo
        addressFrom
        amount
        createdAt
        updatedAt
        currency {
          ticker
          name
        }
      }
    }
    funds {
      id
      name
      ticker
      assetsUnderManagement
      details
    }
    currentAverageExchangeRates(symbols: ["ETH/USDT", "BTC/USDT", "CNY/USD"]) {
      symbol
      rate
      numerator
      denominator
    }
    tenant {
      _id
      tenantId
      name
      domains
      arbitrageEnabled
      branding {
        brandingIconUrl
        logoUrl
        faviconUrl
        colorPrimary
        fontColorPrimary
        colorSecondary
        fontColorSecondary
        colorTertiary
        fontColorTertiary
      }
      authRequireMFA
      authRequireEmail
      authRequirePhone
      authMfaEnabled
      authPrimaryIdentifier
    }
  }`)
)

const DashboardPageMobile = withQuery(({ data }) => {
  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const {
    me,
    funds,
    portfolios,
    tenant,
  } = data

  document.title = `${tenant.name} - Fund Projections`

  return (
    <Suspense fallback={<Loading />}>
      <div className="Page DashboardPage">
        <PortfolioSnapshot me={me} expandable defaultExpanded={false} />
        <FeatureFlag flag={tenant.arbitrageEnabled}>
          <ArbitrageOpportunitiesTable.Mobile noMoreItemsText={null} limit={6} />
          <ExchangesTableWithData.Mobile />
          <ArbitrageTradesTable.Mobile limit={6} />
        </FeatureFlag>
        <FeatureFlag flag={!tenant.arbitrageEnabled}>
          <ChooseDepositCurrency />
          {/*<FundsCarousel funds={funds} />*/}
          <RecentTransactions transactions={me.transactions} />
        </FeatureFlag>
      </div>
    </Suspense>
  )
})


const DashboardPageDesktop =  withQuery(({ data }) => {
  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const {
    me,
    funds,
    portfolios,
    tenant,
  } = data

  document.title = `${tenant.name} - Fund Projections`

  return (
    <Suspense fallback={<Loading />}>
      <div className="Page DashboardPage">
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <ExchangesTableWithData.Desktop />
          </Col>
          <Col span={24}>
            <RebalancesTableWithData.Desktop />
          </Col>
          <Col span={24}>
            <ArbitrageOpportunitiesTable.Desktop noMoreItemsText={null} limit={6} />
          </Col>
          <Col span={24}>
            <ArbitrageTradesTable.Desktop limit={6} />
          </Col>
        </Row>
      </div>
    </Suspense>
  )
})

export default {
  Mobile: DashboardPageMobile,
  Desktop: DashboardPageDesktop,
}

