import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, Query } from 'react-apollo'
import { pathOr } from 'ramda'
import gql from 'graphql-tag'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Table as ADTable } from 'antd'

import Table from '@/components/Table'
import Card from '@/components/Card'

const EXCHANGES_QUERY = gql`
  query Exchanges {
    exchanges {
      exchange
      balances
      balanceHistory
    }
    exchangeOrders {
      _id
      buyOrder
      sellOrder
      buyExchange
      sellExchange
      buyOrderId
      sellOrderId
    }
    myExchangeAccount
  }
`

const EXCHANGES_SUBSCRIPTION = gql`
  subscription ExchangeBalancesChanged {
    exchangeBalancesChanged {
      exchanges {
        exchange
        balances
        balanceHistory
      }
      exchange
      balances
    }
  }
`

const ExchangesTableMobile = withRouter(({
  history,
  limit = Infinity,
  items = [],
  subscribeToUpdatedExchangeBalances,
}) => {
  const { t } = useTranslation()
  subscribeToUpdatedExchangeBalances()
  const balances = items.map(item => item.balances.total)
  const totalBalances = balances.reduce((acc, totals) => {
    Object.entries(totals).forEach(([ticker, balance]) => {
      acc[ticker] = (typeof acc[ticker] !== 'number') ? balance : acc[ticker] += balance
    })
    return acc
  }, {})
  const totalBalancesFilteredArray = Object.entries(totalBalances).filter(([ticker, balance]) => balance > 0)
  return (
    <Card
      className="ExchangesTable TableCard"
      title={t('Exchanges')}
    >
      <div style={{ padding: '1.25em 0.75em' }}>
        All Exchanges
        {totalBalancesFilteredArray.map(([ticker, balance], i) => <div key={i}>{ticker}: {balance}</div>)}
      </div>
      <Table
        items={(items && items.slice(0, limit)) || []}
        noMoreItemsText={null}
      >
        {({ expandRow, isExpanded, item, ...rest }) => {
          return (
            <Table.Row className="TableRow" key={item.exchange}>
              <div className="TableRowTop">
                <div className="flex-column flex-center">
                  {item.exchange}
                </div>
              </div>
              <Table.SubRow className={cx({
                Collapsed: false,
                'flex-column': true,
              })}>
                {Object.entries(item.balances.total)
                  .filter(([ticker, balance]) => balance > 0)
                  .map(([ticker, balance], i) => <Table.RowDetailPair key={i} label={ticker} value={balance} />
                  )}
              </Table.SubRow>
            </Table.Row>
          )
        }}
      </Table>
    </Card>
  )
})


const ExchangesTableWithDataMobile = () => (
  <Query query={EXCHANGES_QUERY}>
    {({ subscribeToMore, ...result }) => {
      return (
        <ExchangesTableMobile
          items={pathOr([], ['data', 'exchanges'], result)}
          subscribeToUpdatedExchangeBalances={() =>
            subscribeToMore({
              document: EXCHANGES_SUBSCRIPTION,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                return subscriptionData.data.exchangeBalancesChanged
              },
            })
          }
        />
      )
    }}
  </Query>
)

const ExchangesTableDesktop = withRouter(({
  history,
  limit = Infinity,
  items = [],
  subscribeToUpdatedExchangeBalances,
  loading,
}) => {
  const { t } = useTranslation()
  subscribeToUpdatedExchangeBalances()
  const balances = items.map(item => item.balances.total)
  const totalBalances = balances.reduce((acc, totals) => {
    Object.entries(totals).forEach(([ticker, balance]) => {
      acc[ticker] = (typeof acc[ticker] !== 'number') ? balance : acc[ticker] += balance
    })
    return acc
  }, {})
  const totalBalancesFilteredArray = Object.entries(totalBalances).filter(([ticker, balance]) => balance > 0)
  return (
    <Query query={EXCHANGES_QUERY}>
      {({ subscribeToMore, ...result }) => {
        return (
          <div>
            <ADTable
              title={() => 'All Exchanges'}
              columns={[
                {
                  title: 'currency',
                  dataIndex: 'ticker',
                  key: 'ticker',
                  width: 100,
                },
                {
                  title: 'balance',
                  dataIndex: 'balance',
                  key: 'balance',
                  width: 100,
                },
              ]}
              dataSource={totalBalancesFilteredArray.map(([ticker, balance], i) => ({ ticker, balance }))}
              loading={loading}
              scroll={{ x: '1300' }}
              size={'middle'}
              bordered
              pagination={false}
            />
            <ADTable
              title={() => 'ExchangesTableWithData'}
              columns={[
                {
                  title: 'exchange',
                  dataIndex: 'exchange',
                  key: 'exchange',
                },
                {
                  title: 'Currency',
                  children: [
                    {
                      title: 'BTC',
                      children: [
                        {
                          title: 'total',
                          dataIndex: 'balances.total.BTC',
                          key: 'balances.total.BTC',
                        },
                        {
                          title: 'free',
                          dataIndex: 'balances.free.BTC',
                          key: 'balances.free.BTC',
                        },
                        {
                          title: 'used',
                          dataIndex: 'balances.used.BTC',
                          key: 'balances.used.BTC',
                        },
                      ],
                    },
                    {
                      title: 'USDT',
                      children: [
                        {
                          title: 'total',
                          dataIndex: 'balances.total.USDT',
                          key: 'balances.total.USDT',
                        },
                        {
                          title: 'free',
                          dataIndex: 'balances.free.USDT',
                          key: 'balances.free.USDT',
                        },
                        {
                          title: 'used',
                          dataIndex: 'balances.used.USDT',
                          key: 'balances.used.USDT',
                        },
                      ],
                    },
                    {
                      title: 'ETH',
                      children: [
                        {
                          title: 'total',
                          dataIndex: 'balances.total.ETH',
                          key: 'balances.total.ETH',
                        },
                        {
                          title: 'free',
                          dataIndex: 'balances.free.ETH',
                          key: 'balances.free.ETH',
                        },
                        {
                          title: 'used',
                          dataIndex: 'balances.used.ETH',
                          key: 'balances.used.ETH',
                        },
                      ],
                    },
                    {
                      title: 'XRP',
                      children: [
                        {
                          title: 'total',
                          dataIndex: 'balances.total.XRP',
                          key: 'balances.total.XRP',
                        },
                        {
                          title: 'free',
                          dataIndex: 'balances.free.XRP',
                          key: 'balances.free.XRP',
                        },
                        {
                          title: 'used',
                          dataIndex: 'balances.used.XRP',
                          key: 'balances.used.XRP',
                        },
                      ],
                    },
                  ],
                },
              ]}
              dataSource={items}
              loading={loading}
              scroll={{ x: '1300' }}
              size={'middle'}
              bordered
              pagination={false}
            />
          </div>
        )
      }}
    </Query>
  )
})

const ExchangesTableWithDataDesktop = () => (
  <Query query={EXCHANGES_QUERY}>
    {({ subscribeToMore, loading, ...result }) => {
      return (
        <ExchangesTableDesktop
          items={pathOr([], ['data', 'exchanges'], result)}
          subscribeToUpdatedExchangeBalances={() =>
            subscribeToMore({
              document: EXCHANGES_SUBSCRIPTION,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                return subscriptionData.data.exchangeBalancesChanged
              },
            })
          }
          loading={loading}
        />
      )
    }}
  </Query>
)

export default {
  Mobile: ExchangesTableWithDataMobile,
  Desktop: ExchangesTableWithDataDesktop,
}
