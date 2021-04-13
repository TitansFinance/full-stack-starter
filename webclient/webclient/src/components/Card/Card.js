import React from 'react'
import cx from 'classnames'

import './Card.sass'

const Card = ({
  onClick = () => ({}),
  children,
  className = '',
  header = null,
  footer = null,
  title = null,
  buttonContent = null,
  buttonAction = () => ({}),
  ...rest
}) => {

  const headerContent = header || (title || buttonContent) ? (
    <>
      {title ? <span className="CardHeaderTitle">{title}</span> : null}
      {buttonContent ? <span className="CardHeaderActionButton" onClick={() => buttonAction()}>{buttonContent}</span> : null}
    </>
  ) : null

  return (
    <div
      className={cx({
        Card: true,
        CardWithHeader: Boolean(title || header || buttonContent),
        CardWithFooter: Boolean(footer),
        [className]: Boolean(className),
      })}
      onClick={onClick}
      {...rest}
    >
      {headerContent ? (
        <div className="CardHeader">
          {headerContent}
        </div>
      ) : null}
      <div className="CardContent">
        {children}
      </div>
      {footer ? (
        <div className="CardFooter">
          {footer}
        </div>
      ) : null}
    </div>
  )
}

export default Card
