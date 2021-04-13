import React from 'react'

import ChooseDepositCurrency from '@/components/ChooseDepositCurrency'
import './DepositPage.sass'

const DepositPage = props => {
  return (
    <div className="Page DepositPage">
      <ChooseDepositCurrency />
    </div>
  )
}

export default DepositPage
