import React from 'react'
import { Query } from 'react-apollo'
import gql  from 'graphql-tag'
import { useTranslation } from 'react-i18next'
import { Table as ADTable } from 'antd'
import { path, pathOr } from 'ramda'

import moment from '@/constructors/moment'
import Table from '@/components/Table'
import TableRowArbitrageTrade from '@/components/TableRowArbitrageTrade'
import Card from '@/components/Card'
import Loading from '@/components/Loading'

import './ArbitrageTradesTable.sass'


const ArbitrageTradesTableMobile = ({ limit = 6, ...rest }) => {
  const { t } = useTranslation()
  return (
    <Query
      query={gql`{
        arbitrageTrades
      }`}
      pollInterval={60000}
    >
      {({ data, error, loading }) => {
        if (loading) return <Loading />
        if (error) console.error(error)
        const { arbitrageTrades } = data
        if (!arbitrageTrades || !arbitrageTrades.length) return 'No Trades'
        return (
          <Card
            className="ArbitrageTradesTable TableCard"
            title={t('Arbitrage\ Trades')}
          >
            <Table
              items={(arbitrageTrades && arbitrageTrades.slice(0, limit)) || []}
              {...rest}
            >
              {(props) => <TableRowArbitrageTrade {...props} />}
            </Table>
          </Card>
        )
      }}
    </Query>
  )
}


const ArbitrageTradesTableDesktop = ({ limit = 6, ...rest }) => {
  const { t } = useTranslation()
  return (
    <Query
      query={gql`{
        arbitrageTrades
        me {
          id
          currency
        }
      }`}
      pollInterval={60000}
    >
      {({ data, error, loading }) => {
        if (loading) return <Loading />
        if (error) console.error(error)
        const {
          arbitrageTrades,
          me: { currency },
        } = data
        console.log('arbitrageTrades: ', arbitrageTrades)
        return (
          <div>
            <ADTable
              title={() => 'ArbitrageTradesTable'}
              columns={[
                {
                  title: 'symbol',
                  dataIndex: 'buyOrder.symbol',
                  key: 'buyOrder.symbol',
                  fixed: true,
                },
                {
                  title: 'buyExchange',
                  dataIndex: 'buyOrder.exchange',
                  key: 'buyExchange',
                  fixed: true,
                },
                {
                  title: 'sellExchange',
                  dataIndex: 'sellOrder.exchange',
                  key: 'sellExchange',
                  fixed: true,
                },
                {
                  title: 'percentSpread',
                  dataIndex: 'percentSpread',
                  key: 'percentSpread',
                },
                {
                  title: 'spread',
                  dataIndex: 'spread',
                  key: 'spread',
                },
                {
                  title: 'buy',
                  children: [
                    {
                      title: 'price',
                      dataIndex: 'buyOrder.price',
                      key: 'buyOrder.price',
                    },
                    {
                      title: 'amount',
                      dataIndex: 'buyOrder.amount',
                      key: 'buyOrder.amount',
                    },
                    {
                      title: 'filled',
                      dataIndex: 'buyOrder.filled',
                      key: 'buyOrder.filled',
                    },
                    {
                      title: 'timestamp',
                      dataIndex: 'timestamp',
                      key: 'timestamp',
                    },
                  ],
                },
                {
                  title: 'sell',
                  children: [
                    {
                      title: 'price',
                      dataIndex: 'sellOrder.price',
                      key: 'sellOrder.price',
                    },
                    {
                      title: 'amount',
                      dataIndex: 'sellOrder.amount',
                      key: 'sellOrder.amount',
                    },
                    {
                      title: 'filled',
                      dataIndex: 'sellOrder.filled',
                      key: 'sellOrder.filled',
                    },
                    {
                      title: 'timestamp',
                      dataIndex: 'sellOrder.timestamp',
                      key: 'sellOrder.timestamp',
                    },
                  ],
                },
                {
                  title: 'date',
                  dataIndex: 'buyOrder.timestamp',
                  key: 'buyOrder.timestamp',
                  width: 100,
                  render: (_, r) => {
                    const ts = pathOr(path(['sellOrder', 'timestamp'], r), ['buyOrder', 'timestamp'], r)
                    return ts ? moment(new Date(parseInt(ts))).fromNow() : '--'
                  },
                },
              ]}
              dataSource={arbitrageTrades}
              loading={loading}
              scroll={{ x: '1300' }}
              size={'middle'}
              bordered
              pagination={{
                position: 'bottom',
                pageSize: 20,
              }}
            />
          </div>
        )
      }}
    </Query>
  )
}

export default {
  Mobile: ArbitrageTradesTableMobile,
  Desktop: ArbitrageTradesTableDesktop,
}
