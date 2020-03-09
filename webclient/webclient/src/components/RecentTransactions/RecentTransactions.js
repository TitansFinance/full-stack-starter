import React, { Component, useState, Suspense } from 'react'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'
import { FlagIcon } from 'react-flag-kit'
import {
  MdCheckCircle,
  MdArrowForward,
  MdMonetizationOn,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import Table from '@/components/Table'
import Card from '@/components/Card'
import TableRowTransaction from '@/components/TableRowTransaction'
import Loading from '@/components/Loading'

import './RecentTransactions.sass'


const RecentTransactions = withRouter((props) => {
  let { transactions, history } = props

  const { t } = useTranslation()
  return (
    <Suspense fallback={<div><Loading /></div>}>
      <Card
        className="RecentTransactions TableCard"
        title={t('RecentTransactions.title')}
        buttonAction={() => history.push('/transactions')}
        buttonContent={t('RecentTransactions.button-content')}
      >
        <Table
          items={(transactions && transactions.slice(0, 3))}
          noMoreItemsText={t('No\ more\ transactions')}
        >
          {(props) => <TableRowTransaction {...props} />}
        </Table>
      </Card>
    </Suspense>
  )
})

export default RecentTransactions
