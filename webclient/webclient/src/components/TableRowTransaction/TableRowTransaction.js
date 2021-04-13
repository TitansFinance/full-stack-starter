import React, { Suspense } from 'react'
import cx from 'classnames'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FlagIcon } from 'react-flag-kit'
import {
  MdCheckCircle,
  MdArrowForward,
  MdArrowBack,
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
import './TableRowTransaction.sass'


const TableRowTransaction = compose(
  graphql(gql`{
    me {
      id
      wallets {
        address
        type
      }
    }
  }`)
)(({ data, index, item, isExpanded, expandRow }) => {
  if (data.error) console.error(data.error)
  if (data.loading) return null
  const { t, i18n } = useTranslation()
  const {
    amount,
    addressTo,
    addressFrom,
    type,
    transaction: { status },
    currency: { ticker },
    updatedAt,
  } = item
  const { me: { wallets } } = data
  const wallet = userWalletForCurrency(wallets, ticker)
  const isDeposit = (wallet.address === addressTo)
  const value = standardUnitFromBaseUnit(amount, ticker)
  const lastUpdated = moment(new Date(parseInt(updatedAt, 10))).fromNow()

  return (
    <Suspense fallback={<Loading />}>
      <Table.Row className="TableRowTransaction" onClick={() => expandRow(!isExpanded)}>
        <div className="TableRowTransactionTop">
          <CurrencyIcon ticker={ticker} />
          <div className="TableRowTransactionInfo">
            <Table.SubRow>
              <div>
                {isDeposit ? <MdArrowForward style={{ color: 'green' }} /> : <MdArrowBack style={{ color: 'red' }} />}
                {shortAddress(addressTo) /* TODO */}
              </div>
              <div>
                {ticker} {value}
              </div>
            </Table.SubRow>
            <Table.SubRow>
              <div className="TransactionTableRowStatus"><MdCheckCircle /> <span>{lastUpdated}</span></div>
              <div className="TransactionTableRowAmount"><span><CurrencyConverter value={value} valueCurrency={ticker} /></span></div>
            </Table.SubRow>
          </div>
        </div>
        <div>
          <Table.SubRow className={cx({
            TableRowTransactionDetails: true,
            Collapsed: !isExpanded,
          })}>
            <Table.RowDetailPair label={t('TableRowTransaction.Type')} value={isDeposit ? t('Deposit') : t('Withdrawal')} />
            <Table.RowDetailPair label={t('TableRowTransaction.Status')} value={t(capitalize(status))} />
            <Table.RowDetailPair label={t('TableRowTransaction.From')} value={shortAddress(addressFrom, 26) || t('External')} />
            <Table.RowDetailPair label={t('TableRowTransaction.To')} value={shortAddress(addressTo, 26) || t('External')} />
            <Table.RowDetailPair label={t('TableRowTransaction.Value')} value={value} />
            <Table.RowDetailPair label={t('TableRowTransaction.Fees')} value={'0'} />
            <Table.RowDetailPair label={t('TableRowTransaction.Timestamp')} value={lastUpdated} />
          </Table.SubRow>
        </div>
      </Table.Row>
    </Suspense>
  )
})


export default TableRowTransaction
