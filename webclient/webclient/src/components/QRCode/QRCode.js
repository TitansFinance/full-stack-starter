import React from 'react'
import cx from 'classnames'
import QRImage from 'qr-image'

import './QRCode.sass'

const QRCode = ({
  text,
  className,
  ...rest
}) => {
  if (!text) return null
  try {
    const svg_string = QRImage.imageSync(text, { type: 'svg' })
    return (
      <div
        className={cx({ QRCode, [className]: Boolean(className) })}
        dangerouslySetInnerHTML={{ __html: svg_string }}
      />
    )
  } catch (error) {
    console.error(error)
    return null
  }
}

export default QRCode
