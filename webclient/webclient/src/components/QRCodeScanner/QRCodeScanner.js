import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import './QRCodeScanner.sass'
import { useTranslation } from 'react-i18next'

import Button from '@/components/Button'
import { QRVideoScanner } from '@/utils/qr'

const QRCodeScanner = ({
  className,
  onClose = () => ({}),
  onResult = () => ({}),
  srcObject,
  ...rest
}) => {
  const { t } = useTranslation()
  const video = useRef(null)
  const [scanner, setScanner] = useState(null)
  useEffect(() => {
    if (srcObject) {
      video.current.srcObject = srcObject
      const s = QRVideoScanner(video.current, (r) => onResult(r))
      setScanner(s)
      s.start()
    }
  }, [srcObject])
  useEffect(() => {}, () => {
    scanner.destroy()
  })
  return (
    <>
      <div className={cx({ QRCodeScanner, [className]: Boolean(className) })}>
        <video
          ref={video}
          autoPlay
          onClick={(e) => {
            e.stopPropagation()
          }}
          {...rest}
        />
        <span className="CloseButton" onClick={() => onClose()}><span>{t('Cancel')}</span></span>
      </div>
    </>
  )
}

export default QRCodeScanner
