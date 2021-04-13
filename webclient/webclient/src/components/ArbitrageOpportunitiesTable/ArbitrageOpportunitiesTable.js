import React, { Component, useState, Suspense } from 'react'
import { compose, graphql, Query } from 'react-apollo'
import gql  from 'graphql-tag'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'
import { FlagIcon } from 'react-flag-kit'
import {
  MdCheckCircle,
  MdArrowForward,
  MdMonetizationOn,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import moment from '@/constructors/moment'
import { Table as ADTable } from 'antd'

import Table from '@/components/Table'
import TableRowArbitrageOpportunity from '@/components/TableRowArbitrageOpportunity'
import Row from '@/components/Row'
import Card from '@/components/Card'
import Loading from '@/components/Loading'

import './ArbitrageOpportunitiesTable.sass'


const ArbitrageOpportunitiesTableMobile = withRouter(({ history, limit = 6, ...rest }) => {
  const { t } = useTranslation()
  return (
    <Query
      query={gql`{
        spreads(
          symbols: ["BTC/USDT"],
          limit: 6
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
      }`}
      pollInterval={60000}
    >
      {({ data, error, loading }) => {
        if (loading) return <Loading />
        if (error) console.error(error)
        const spreads = data && data.spreads || []
        console.log(data)
        return (
          <Card
            className="ArbitrageOpportunitiesTable TableCard"
            title={t('Arbitrage\ Opportunities')}
          >
            <Table
              items={(spreads && spreads.slice(0, limit)) || []}
              {...rest}
            >
              {(props) => <TableRowArbitrageOpportunity {...props} />}
            </Table>
          </Card>
        )
      }}
    </Query>
  )
})

const ArbitrageOpportunitiesTableDesktop = withRouter(({ history, limit = 6, ...rest }) => {
  const { t } = useTranslation()
  return (
    <Query
      query={gql`{
        spreads(
          symbols: ["BTC/USDT"],
          limit: 30
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
      }`}
      pollInterval={60000}
    >
      {({ data, error, loading }) => {
        if (error) console.error(error)
        const spreads = data && data.spreads || []
        return (
          <div>
            <ADTable
              title={() => 'ArbitrageOpportunitiesTable'}
              columns={[
                {
                  title: 'symbol',
                  width: 30,
                  dataIndex: 'symbol',
                  key: 'symbol',
                  fixed: true,
                },
                {
                  title: 'buyExchange',
                  width: 70,
                  dataIndex: 'buyExchange',
                  key: 'buyExchange',
                  fixed: true,
                },
                {
                  title: 'sellExchange',
                  width: 70,
                  dataIndex: 'sellExchange',
                  key: 'sellExchange',
                  fixed: true,
                },
                {
                  title: 'percentSpread',
                  width: 100,
                  dataIndex: 'percentSpread',
                  key: 'percentSpread',
                },
                {
                  title: 'spread',
                  width: 100,
                  dataIndex: 'spread',
                  key: 'spread',
                },
                {
                  title: 'rawSpread',
                  dataIndex: 'rawSpread',
                  key: 'rawSpread',
                },
                {
                  title: 'fees',
                  dataIndex: 'fees',
                  key: 'fees',
                },
                {
                  title: 'date',
                  dataIndex: 'date',
                  key: 'date',
                  width: 100,
                  render: (_, record, i) => moment(new Date(parseInt(record.date))).fromNow(),
                },
                {
                  title: 'buyPrice',
                  dataIndex: 'buyPrice',
                  key: 'buyPrice',
                },
                {
                  title: 'sellPrice',
                  dataIndex: 'sellPrice',
                  key: 'sellPrice',
                },
                {
                  title: 'buyQuantity',
                  dataIndex: 'buyQuantity',
                  key: 'buyQuantity',
                },
                {
                  title: 'sellQuantity',
                  dataIndex: 'sellQuantity',
                  key: 'sellQuantity',
                },
              ]}
              dataSource={spreads}
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
})




export default {
  Mobile: ArbitrageOpportunitiesTableMobile,
  Desktop: ArbitrageOpportunitiesTableDesktop,
}
