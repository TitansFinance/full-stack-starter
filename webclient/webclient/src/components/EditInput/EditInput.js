import React, { useState } from 'react'
import cx from 'classnames'
import { MdSave, MdEdit } from 'react-icons/md'

import Input from '@/components/Input'
import './EditInput.sass'

const EditInput = ({
  className = '',
  value = '',
  label = null,
  editing = false,
  defaultInEditMode = false,
  focusRoot = null,
  onEdit = () => ({}),
  onSave = () => ({}),
  ...rest
}) => {
  return (
    <Input
      form
      readOnly={!editing}
      value={value}
      className={cx({ EditInput: true, WithLabel: Boolean(label), [className]: Boolean(className) })}
      withInnerButton
      label={label}
      {...rest}
    >
      <span className="InnerTextButton">
        {editing ? (
          null
        ) : (
          <MdEdit onClick={() => {
            if (focusRoot) focusRoot.querySelector(`${className ? `.${className}` : ''}.EditInput input`).focus()
            onEdit(value)
          }}
          />
        )}
      </span>
    </Input>
  )
}

export default EditInput
