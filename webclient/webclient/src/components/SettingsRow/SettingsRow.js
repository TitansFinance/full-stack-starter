import React, { Component } from 'react'
import cx from 'classnames'

import './SettingsRow.sass'

import Row from '@/components/Row'

const SettingsRow = ({
  children,
  className = '',
  title = null,
  actionButton = null,
  ...rest
}) => {
  return (
    <Row className={cx({ SettingsRow: true, [className]: Boolean(className) })} {...rest}>
      {title ? <h3>
        {title}
        {actionButton ? actionButton : null}
      </h3> : null}
      <Row className="SettingsRowContent">
        {children}
      </Row>
    </Row>
  )
}

export default SettingsRow
