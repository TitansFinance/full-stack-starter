import React, { useEffect } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'

import './Modal.sass'

const noscroll = () => window.scrollTo(0, 0)


const Modal = connect(
  state => ({
    modal: state.modal,
  })
)(({
  className = '',
  modal = {},
  dispatch = () => ({}),
  ...rest
}) => {
  const {
    show,
    renderer,
    userMayExit = true,
  } = modal
  if (!show || !renderer) return null
  if (typeof renderer !== 'function') {
    console.warn('[Modal] Renderer must be a functional component. Received: ', renderer)
  }

  const dismiss = (force = userMayExit) => force && dispatch({
    type: 'MODAL_SET',
    payload: {
      show: false,
      renderer: null,
    },
  })

  // useEffect(() => {
  //   if (show) {
  //     window.addEventListener('scroll', noscroll)
  //   } else {
  //     window.removeEventListener('scroll', noscroll)
  //   }
  // }, [show])

  return (
    <div
      className={cx({ Modal: true, [className]: Boolean(className) })}
      onClick={dismiss}
      {...rest}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {renderer({ dismiss })}
      </div>
    </div>
  )
})

export default Modal
