import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MdInfoOutline } from 'react-icons/md'

import Card from '@/components/Card'
import ChooseCurrency from '@/components/ChooseCurrency'
import ModalContentDepositCurrency from '@/components/ModalContentDepositCurrency'

const ChooseDepositCurrency = connect()(({ dispatch }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  return (
    <Card
      title={t('Deposit')}
      className="ChooseDepositCurrency"
      buttonAction={() => {
        setExpanded(!expanded)}
      }
      buttonContent={<MdInfoOutline />}
    >
      <ChooseCurrency
        currencyIconOnClick={({ currency }) => dispatch({
          type: 'MODAL_SET',
          payload: {
            show: true,
            renderer: ({ dismiss }) => (
              <ModalContentDepositCurrency currency={currency} dismiss={dismiss} />
            ),
          },
        })}
      />
      {expanded ? <div className="ChooseCurrencyInfo" dangerouslySetInnerHTML={{ __html: t('ChooseCurrency.info') }} /> : null}
    </Card>
  )
})

export default ChooseDepositCurrency
