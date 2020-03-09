import React from 'react'
import './WithdrawPage.sass'

import WithdrawCurrency from '@/components/WithdrawCurrency'

const WithdrawPage = props => {
  return (
    <div className="Page WithdrawPage">
      <WithdrawCurrency />
    </div>
  )
}

export default WithdrawPage
