import React, { useRef } from 'react'
import cx from 'classnames'
import { isEmpty } from 'ramda'

import './Input.sass'

const Input = ({
  className = null,
  inline = false,
  form = false,
  value = '',
  readOnly = false,
  label = null,
  errorMessage = () => null,
  children,
  allowInputs = null,
  allowEmpty = true,
  withInnerButton = null,
  onChange = () => {},
  ...rest
}) => {
  const input = useRef(null)
  return (
    <div className={cx({
      Input: true,
      [className]: Boolean(className),
      InlineInput: inline,
      WithInnerButton: Boolean(withInnerButton),
      FormInput: form,
      ReadOnly: readOnly,
      error: Boolean(errorMessage()),
    })}>
      {label ? (
        <label>
          {label}
        </label>
      ) : null}
      <input ref={input} value={value} {...rest} readOnly={readOnly} onChange={(e) => {
        if (allowEmpty && isEmpty(e.target.value)) return onChange(e)
        if (allowInputs && !allowInputs(e.target.value)) return null
        onChange(e)
      }} />
      <span className="InputErrorMessage">{errorMessage() || null}</span>
      {children}
    </div>
  )
}

Input.REGEX = {
  DECIMAL: new RegExp('^[0-9]*[.]?[0-9]*$'),
  ALPHA_NUMERIC_SPACES: new RegExp('^[a-zA-Z0-9 ]+$'),
  USERNAME: new RegExp('^[a-zA-Z0-9 -]+$'),
  ALPHA_NUMERIC: new RegExp('^[a-zA-Z0-9]+$'),
  ALPHA_NUMERIC_HYPHENS: new RegExp('^[a-zA-Z0-9-]+$'),
  PASSWORD: new RegExp('^[a-zA-Z0-9$&!@#]+$'),
}

Input.allow = {
  decimal: v => Boolean(v.match(Input.REGEX.DECIMAL)),
  alphanumeric: v => Boolean(v.match(Input.REGEX.ALPHA_NUMERIC)),
  alphanumericWithSpaces: v => Boolean(v.match(Input.REGEX.ALPHA_NUMERIC_SPACES)),
  password: v => Boolean(v.match(Input.REGEX.PASSWORD)),
  username: v => Boolean(v.match(Input.REGEX.USERNAME)),
  firstLastNames: v => Boolean(v.match(Input.REGEX.ALPHA_NUMERIC_HYPHENS)),
}



export default Input
