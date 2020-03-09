import React, { useEffect } from 'react'
import { connect } from 'react-redux'


const ResizeListener = ({ dispatch, layout }) => {
  const resize = () => {
    const mobile = window.innerWidth <= 576
    const tablet = window.innerWidth > 576 && window.innerWidth <= 1024
    const desktop = window.innerWidth > 1024
    const type = (mobile ? 'mobile' : (tablet ? 'tablet' : (desktop ? 'desktop' : null)))
    if (type !== layout.type) dispatch({ type: 'LAYOUT_UPDATE_TYPE', payload: { type } })
  }
  useEffect(() => window.addEventListener('resize', resize),
    () => window.removeEventListener('resize', resize))
  resize()
  return null
}

export default connect(state => ({
  layout: state.layout,
}))(ResizeListener)
