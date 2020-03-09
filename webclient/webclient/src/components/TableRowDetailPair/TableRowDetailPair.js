import React from 'react'
import cx from 'classnames'

import Row from '@/components/Row'

import './TableRowDetailPair.sass'

const TableRowDetailPair = ({ label, children, className, value }) => (
  <div className={cx({ TableRowDetailPair: true, [className]: Boolean(className) })}>
    <div className="TableRowDetailPairLabel">{label}</div>
    <div className="TableRowDetailPairValue">{value}</div>
    {children}
  </div>
)

export default TableRowDetailPair
