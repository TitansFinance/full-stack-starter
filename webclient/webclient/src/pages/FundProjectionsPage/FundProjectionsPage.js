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
import { Row, Col, Checkbox, InputNumber, Tooltip, Table as ADTable } from 'antd'
import ReactSelect from 'react-select'


import history from '@/constructors/history'
import moment from '@/constructors/moment'

import Button from '@/components/Button'
import Table from '@/components/Table'
import Card from '@/components/Card'

import Loading from '@/components/Loading'
import FeatureFlag from '@/components/FeatureFlag'

import './FundProjectionsPage.sass'


const withQuery = compose(
  graphql(gql`{
    me {
      id
      username
      email
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


const FundProjectionsPageMobile = withQuery(({ data }) => {
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
      <div className="Page FundProjectionsPage">
        <h2>Projections</h2>
        <p>Coming soon...</p>
      </div>
    </Suspense>
  )
})


const OpportunitiesTable = ({ data, loading }) => {
  return (
    <ADTable
      pagination={{
        position: 'bottom',
        pageSize: 100,
      }}
      title={() => 'Opportunities'}
      columns={[
        {
          title: 'Exchange Pairs',
          dataIndex: 'pair',
          key: 'pair',
        },
        {
          title: '# spreads',
          dataIndex: 'numSpreads',
          key: 'numSpreads',
        },
        {
          title: 'Max spread (Size)',
          dataIndex: 'maxSpread',
          key: 'maxSpread',
        },
        {
          title: 'Average Spread ($)',
          dataIndex: 'avgSpread',
          key: 'avgSpread',
        },
        {
          title: 'Average Spread %',
          dataIndex: 'avgSpreadPercentage',
          key: 'avgSpreadPercentage',
        },
        {
          title: 'Average Size',
          dataIndex: 'avgSize',
          key: 'avgSize',
        },
        {
          title: 'Max BTC Needed',
          dataIndex: 'maxBTCNeeded',
          key: 'maxBTCNeeded',
        },
        {
          title: 'Max. $ Opp',
          dataIndex: 'maxUSDOpportunity',
          key: 'maxUSDOpportunity',
        },
      ]}
      dataSource={data}
      loading={loading}
      size={'small'}
      bordered
    />
  )
}

const OpportunitiesTableWithData = ({
  data = [],
  ...rest
}) => {
  const pairDetails = {}

  data && data.length && data.filter(item => Boolean(item.spread)).forEach((spread, i) => {
    if (!pairDetails[spread.exchangePair]) {
      pairDetails[spread.exchangePair] = [spread]
    } else {
      pairDetails[spread.exchangePair].push(spread)
    }
  })

  const opportunities = Object.entries(pairDetails).map(([pair, spreads]) => {
    window[`spreads.${pair}`] = spreads
    const numSpreads = spreads.length
    const totalSpread = spreads.reduce((acc, entry) => {
      return acc + parseFloat(entry.spread)
    }, 0)
    const totalSpreadPercentage = spreads.reduce((acc, entry) => {
      return acc + parseFloat(entry.percentSpread)
    }, 0)
    const spreadFloats = spreads.map(s => parseFloat(s.spread))
    const maxSpread = Math.max(...spreadFloats)
    const avgSpread = totalSpread / numSpreads
    const avgSpreadPercentage = totalSpreadPercentage / numSpreads

    const totalSize = spreads.reduce((acc, entry) => {
      return acc + parseFloat(Math.min(parseFloat(entry.buyQuantity), parseFloat(entry.sellQuantity)))
    }, 0)

    const avgSize = totalSize / numSpreads

    return {
      pair,
      numSpreads,
      maxSpread,
      avgSpread,
      avgSpreadPercentage,
      avgSize,
      maxBTCNeeded: '--',
      maxUSDOpportunity: '--',
    }
  })
  window.opportunities = opportunities
  return (
    <OpportunitiesTable data={opportunities} {...rest} />
  )
}

const RankTable = ({
  title = () => null,
  exchanges = [],
  spreads = [],
  loading,
  exchangeKey = 'buyExchange',
  priceKey = 'buyPrice',
  amountKey = 'buyQuantity',
  direction = 'ASC',
}) => {
  const data = exchanges.map(exchange => {
    const filteredSpreads = spreads
      .filter(sp => sp[exchangeKey] === exchange)
      .filter(sp => Boolean(parseFloat(sp[priceKey])))
      .filter(sp => Boolean(parseFloat(sp[amountKey])))
    const priceTotals = filteredSpreads.reduce((acc, entry) => (acc + parseFloat(entry[priceKey])), 0)
    const amountTotals = filteredSpreads.reduce((acc, entry) => (acc + parseFloat(entry[amountKey])), 0)
    const avgPrice = priceTotals / filteredSpreads.length
    const avgSizeBTC = amountTotals / filteredSpreads.length
    return {
      exchange,
      avgPrice,
      avgSizeBTC,
    }
  })
  console.log(direction)
  const sortedByPrice = data
    .filter(i => (!isNaN(i.avgPrice) && !isNaN(i.avgSizeBTC)))
    .sort((a, b) => (
      direction === 'ASC' ? (a.avgPrice > b.avgPrice) : (a.avgPrice < b.avgPrice)
    ))
  return (
    <ADTable
      title={title}
      columns={[
        {
          title: 'Exchange',
          dataIndex: 'exchange',
          key: 'exchange',
        },
        {
          title: 'Average Price ($)',
          dataIndex: 'avgPrice',
          key: 'avgPrice',
        },
        {
          title: 'Average Size in BTC',
          dataIndex: 'avgSizeBTC',
          key: 'avgSizeBTC',
        },
      ]}
      dataSource={sortedByPrice}
      loading={loading}
      scroll={{ x: '1300' }}
      size={'middle'}
      bordered
      pagination={false}
    />
  )
}

const CalculatedValuesTable = ({ data, loading }) => {
  return (
    <ADTable
      title={() => 'Calculated Values'}
      columns={[
        {
          title: 'params',
          dataIndex: 'params',
          key: 'params',
        },
        {
          title: 'values',
          dataIndex: 'values',
          key: 'values',
        },
        {
          title: 'notes',
          dataIndex: 'notes',
          key: 'notes',
        },
        {
          title: 'formula',
          dataIndex: 'formula',
          key: 'formula',
        },
      ]}
      dataSource={data}
      loading={loading}
      scroll={{ x: '1300' }}
      size={'middle'}
      bordered
      pagination={false}
    />
  )
}

const ExpectedReturnsTable = ({ data, loading }) => {
  return (
    <ADTable
      title={() => 'Calculated Values'}
      columns={[
        {
          title: 'Timeframe',
          dataIndex: 'timeframe',
          key: 'timeframe',
        },
        {
          title: 'Yield',
          dataIndex: 'yield',
          key: 'yield',
        },
        {
          title: 'Transfer Fees',
          dataIndex: 'transferFees',
          key: 'transferFees',
        },
        {
          title: 'Expected Return',
          dataIndex: 'expectedReturn',
          key: 'expectedReturn',
        },
        {
          title: 'Expected Return %',
          dataIndex: 'expectedReturnPercentage',
          key: 'expectedReturnPercentage',
        },
        {
          title: 'After Tax Return',
          dataIndex: 'afterTaxReturn',
          key: 'afterTaxReturn',
        },
        {
          title: 'Per Deal Profit',
          dataIndex: 'perDealProfit',
          key: 'perDealProfit',
        },
      ]}
      dataSource={data}
      loading={loading}
      scroll={{ x: '1300' }}
      size={'middle'}
      bordered
      pagination={false}
    />
  )
}

const ExpectedReturnsFormulaTable = ({}) => {
  return (
    <ADTable
      title={() => 'Expected Returns Formulas'}
      columns={[
        {
          title: 'Timeframe',
          dataIndex: 'timeframe',
          key: 'timeframe',
        },
        {
          title: 'Yield',
          dataIndex: 'yield',
          key: 'yield',
        },
        {
          title: 'Transfer Fees',
          dataIndex: 'transferFees',
          key: 'transferFees',
        },
        {
          title: 'Expected Return',
          dataIndex: 'expectedReturn',
          key: 'expectedReturn',
        },
        {
          title: 'Expected Return %',
          dataIndex: 'expectedReturnPercentage',
          key: 'expectedReturnPercentage',
        },
        {
          title: 'After Tax Return',
          dataIndex: 'afterTaxReturn',
          key: 'afterTaxReturn',
        },
        {
          title: 'Per Deal Profit',
          dataIndex: 'perDealProfit',
          key: 'perDealProfit',
        },
      ]}
      dataSource={[
        {
          timeframe: 'Per Deal Profit',
          yield: 'AveDealSizeBTC x AveDealSize% x SuccessRate x BTC Price',
          transferFees: 'Rebalance%BTC x BTC Price x TradeFrequency / ExhaustRate',
          expectedReturn: 'Yield - Transfer Fees',
          expectedReturnPercentage: 'Expected Return / (Min BTC Required x BTC Price)',
          afterTaxReturn: 'Expected Return (1 - Tax Rate)',
        },
        {
          timeframe: 'Hourly',
          yield: 'Yield x DealsPerHour',
          transferFees: 'Transfer Fees x DealsPerHour',
          expectedReturn: 'Yield - Transfer Fees',
          expectedReturnPercentage: 'Expected Return / (Min BTC Required x BTC Price)',
          afterTaxReturn: 'Expected Return (1 - Tax Rate)',
        },
        {
          timeframe: 'Daily',
          yield: 'Hourly x 24',
        },
        {
          timeframe: 'Monthly',
          yield: 'Daily x 30',
        },
        {
          timeframe: 'Annually',
          yield: 'Daily x 365',
        },
      ]}
      loading={false}
      scroll={{ x: '1300' }}
      size={'middle'}
      bordered
      pagination={false}
    />
  )
}


const FundProjectionsPageDesktop = withQuery(({ data }) => {
  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const {
    me,
    funds,
    portfolios,
    tenant,
  } = data

  document.title = `${tenant.name} - Fund Projections`

  const exchanges = [
    'bitfinex',
    'binance',
    'kucoin',
    'kraken',
    'bittrex',
    'coss',
    'poloniex',
    'huobipro',
    'gateio',
    'okcoinusd',
  ]

  const timeframes = [
    {
      label: '1 month',
      value: moment().subtract({ months: 1 }).valueOf().toString(),
    },
    {
      label: '1 week',
      value: moment().subtract({ weeks: 1 }).valueOf().toString(),
    },
    {
      label: '24 hr',
      value: moment().subtract({ days: 1 }).valueOf().toString(),
    },
    {
      label: '12 hr',
      value: moment().subtract({ hours: 12 }).valueOf().toString(),
    },
    {
      label: '2 hr',
      value: moment().subtract({ hours: 2 }).valueOf().toString(),
    },
    {
      label: '1 hr',
      value: moment().subtract({ hours: 1 }).valueOf().toString(),
    },
    {
      label: '15 min',
      value: moment().subtract({ minutes: 15 }).valueOf().toString(),
    },
    {
      label: '5 min',
      value: moment().subtract({ minutes: 5 }).valueOf().toString(),
    },
    {
      label: '1 min',
      value: moment().subtract({ minutes: 1 }).valueOf().toString(),
    },
  ]

  const [selectedExchanges, setSelectedExchanges] = useState(exchanges)
  const [timeframe, setTimeframe] = useState(timeframes[0])
  const [minimumSpread, setMinimumSpread] = useState(0.15)
  const [dealFrequency, setDealFrequency] = useState(2)
  const [rebalanceFeePercentage, setRebalanceFeePercentage] = useState(0.02)
  const [successRate, setSuccessRate] = useState(80.00)
  const [transferTime, setTransferTime] = useState(30)
  const [btcPerExchange, setBtcPerExchange] = useState(3)
  const [taxBracketPercentage, setTaxBracketPercentage] = useState(37.00)

  // const indeterminate: true,
  // checkAll: false,

  return (
    <Suspense fallback={<Loading />}>
      <div className="Page FundProjectionsPage">
        <h2>Fund Projections</h2>
        <Row>
          <Col span={6}>
            <span>Exchanges</span>
            <Checkbox.Group options={exchanges} value={selectedExchanges} onChange={list => {
              setSelectedExchanges(list)
            }} style={{ display: 'flex', flexDirection: 'column' }} />
          </Col>
          <Col span={4}>
            <span>Timeframe</span>
            <ReactSelect
              options={timeframes}
              value={timeframe}
              onChange={timeframe => setTimeframe(timeframe)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <br />
            <span>Minimum Spread</span>
            <br />
            <InputNumber
              value={minimumSpread}
              precision={2}
              step={0.01}
              formatter={v => `${v}%`}
              parser={v => v.replace('%', '')}
              onChange={v => setMinimumSpread(v)}
            />
            <br />
            <span>Deal Frequency</span>
            <br />
            <span>X min per deal, e.g. 2 if 1 trade per 2 minutes, or 0.5 if one trade per 30 seconds</span>
            <br />
            <InputNumber
              value={dealFrequency}
              precision={0}
              step={1}
              formatter={v => `${v}min`}
              parser={v => v.replace('min', '')}
              onChange={v => setDealFrequency(v)}
            />
            <br />
            <span>Success Rate</span>
            <br />
            <span>How many deals will go through on average?</span>
            <br />
            <InputNumber
              value={successRate}
              precision={2}
              step={0.01}
              formatter={v => `${v}%`}
              parser={v => v.replace('%', '')}
              onChange={v => setSuccessRate(v)}
            />
            <br />
            <span>Rebalance fee</span>
            <br />
            <span>Different for each platform, assume it’s about 0.02% of BTC on average.
            USDT is usually high in withdrawal fees, compare to TUSD or USDC.</span>
            <br />
            <InputNumber
              value={rebalanceFeePercentage}
              precision={2}
              step={0.01}
              formatter={v => `${v}%`}
              parser={v => v.replace('%', '')}
              onChange={v => setRebalanceFeePercentage(v)}
            />
            <br />
            <span>Transfer Time</span>
            <br />
            <span>Typical transfer time for BTC, for rebalancing</span>
            <br />
            <InputNumber
              value={transferTime}
              precision={0}
              step={1}
              formatter={v => `${v}min`}
              parser={v => v.replace('min', '')}
              onChange={v => setTransferTime(v)}
            />
            <br />
            <span>BTC per exchange</span>
            <br />
            <span>Number of BTC’s we hold in each exchange. The more we have the less we need to rebalance, but requires more capital.</span>
            <br />
            <InputNumber
              value={btcPerExchange}
              precision={0}
              step={1}
              formatter={v => `${v}BTC`}
              parser={v => v.replace('BTC', '')}
              onChange={v => setBtcPerExchange(v)}
            />
            <br />
            <span>Tax bracket</span>
            <br />
            <span>Your expected tax bracket, for calculating post tax return. (Assuming you are not taxed per transaction, which is true for U.S. citizens)</span>
            <br />
            <InputNumber
              value={taxBracketPercentage}
              precision={2}
              step={1}
              formatter={v => `${v}%`}
              parser={v => v.replace('%', '')}
              onChange={v => setTaxBracketPercentage(v)}
            />
            <br />
          </Col>
        </Row>
        <Row>
          <Query
            query={gql`
              query Spreads (
                $symbols: [String!],
                $exchanges: [String!],
                $fromTimestamp: String,
                $toTimestamp: String,
                $limit: Int,
              ) {
                spreads(
                  symbols: $symbols,
                  exchanges: $exchanges,
                  fromTimestamp: $fromTimestamp,
                  toTimestamp: $toTimestamp,
                  limit: $limit,
                ) {
                  _id
                  symbol
                  date
                  spread
                  rawSpread
                  numerator
                  denominator
                  exchangePair
                  fees
                  percentSpread
                  bidOrder
                  askOrder
                  buyPrice
                  sellPrice
                  buyQuantity
                  sellQuantity
                  buyExchange
                  sellExchange
                }
              }
            `}
            variables={{
              symbols: ['BTC/USDT'],
              exchanges: selectedExchanges,
              fromTimestamp: timeframe.value.toString(),
              toTimestamp: moment().valueOf().toString(),
              limit: 10000,
            }}
            pollInterval={60000}
          >
            {({ data, loading, error }) => {
              if (error) console.error(error)
              const spreads = pathOr([], ['spreads'], data)
              console.log('spreads: ', spreads)
              return (
                <>
                  <OpportunitiesTableWithData
                    data={spreads.length && spreads.filter(spread => {
                      return selectedExchanges.includes(spread.buyExchange) && selectedExchanges.includes(spread.sellExchange)
                    })}
                    loading={loading}
                  />

                  <Row>
                    <Col span={12}>
                      <RankTable
                        title={() => 'Rank Buy'}
                        exchanges={selectedExchanges}
                        spreads={spreads}
                        loading={loading}
                        exchangeKey={'buyExchange'}
                        priceKey={'buyPrice'}
                        amountKey={'buyQuantity'}
                        direction={'DESC'}
                      />
                    </Col>
                    <Col span={12}>
                      <RankTable
                        title={() => 'Rank Sell'}
                        exchanges={selectedExchanges}
                        spreads={spreads}
                        loading={loading}
                        exchangeKey={'sellExchange'}
                        priceKey={'sellPrice'}
                        amountKey={'sellQuantity'}
                        direction={'ASC'}
                      />
                    </Col>
                  </Row>

                  <CalculatedValuesTable
                    data={[
                      {
                        params: 'Average Deal Size (BTC)',
                        values: '0.4 BTC',
                        notes: 'Average all the AveSize of Opportunities table',
                        formula: 'Ave(Opportunities.AverageSize)',
                      },
                      {
                        params: 'Average Spread / Deal ($)',
                        values: '$13.15',
                        notes: 'Avearge all the Avespread of Opp. table',
                        formula: 'Ave(Opportunities.AverageSpread)',
                      },
                      {
                        params: '# of Deals / Hour',
                        values: '30',
                        notes: 'Hourly arbitrage deals available',
                        formula: '60 min / Input.DealFrequency',
                      },
                      {
                        params: '# of Deals Made / Hour',
                        values: '27',
                        notes: 'Successfully executed arbitrage deals per hour',
                        formula: '60 min / Input.DealFrequncy x SuccessRate',
                      },
                      {
                        params: 'BTC exhaust rate (min)',
                        values: '15',
                        notes: 'How many minutes before we use up all the BTC in an exchange',
                        formula: 'Input.AveBTCperExchange',
                      },
                      {
                        params: 'BTC exhaust rate (min)',
                        values: '15',
                        notes: 'How many minutes before we use up all the BTC in an exchange',
                        formula: 'Input.AveBTCperExchange x Input.DealFrequency / AverageDealSize',
                      },
                      {
                        params: 'Minimum BTC Required per exchange',
                        values: '2 BTC',
                        notes: 'Minimum amount of BTC needed per exchange to avoid pausing for rebalance',
                        formula: 'Input.TransferTimeInMin / BTCexhaustRateInMin',
                      },
                    ]}
                    loading={loading}
                  />

                  <ExpectedReturnsTable
                    data={[
                      {
                        timeframe: 'Hourly',
                        yield: Math.random() * 4 / (24 * 30),
                        transferFees: Math.random() * 10 / (24 * 30),
                        expectedReturn: Math.random() * 10000 / (24 * 30),
                        expectedReturnPercentage: Math.random() * 100 / (24 * 30),
                        afterTaxReturn: Math.random() * 8000 / (24 * 30),
                        perDealProfit: Math.random() * 5 / (24 * 30),
                      },
                      {
                        timeframe: 'Daily',
                        yield: Math.random() * 4 / 30,
                        transferFees: Math.random() * 10 / 30,
                        expectedReturn: Math.random() * 10000 / 30,
                        expectedReturnPercentage: Math.random() * 100 / 30,
                        afterTaxReturn: Math.random() * 8000 / 30,
                        perDealProfit: Math.random() * 5 / 30,
                      },
                      {
                        timeframe: 'Monthly',
                        yield: Math.random() * 4,
                        transferFees: Math.random() * 10,
                        expectedReturn: Math.random() * 10000,
                        expectedReturnPercentage: Math.random() * 100,
                        afterTaxReturn: Math.random() * 8000,
                        perDealProfit: Math.random() * 5,
                      },
                      {
                        timeframe: 'Annually',
                        yield: Math.random() * 4 * 12,
                        transferFees: Math.random() * 10 * 12,
                        expectedReturn: Math.random() * 10000 * 12,
                        expectedReturnPercentage: Math.random() * 100 * 12,
                        afterTaxReturn: Math.random() * 8000 * 12,
                        perDealProfit: Math.random() * 5 * 12,
                      },
                    ]}
                    loading={loading}
                  />

                  <ExpectedReturnsFormulaTable loading={loading} />
                </>
              )
            }}
          </Query>
        </Row>
      </div>
    </Suspense>
  )
})

export default {
  Mobile: FundProjectionsPageMobile,
  Desktop: FundProjectionsPageDesktop,
}

