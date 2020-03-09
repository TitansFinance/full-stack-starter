import React from 'react'
import cx from 'classnames'
import { MetroSpinner } from 'react-spinners-kit'

import './Loading.sass'

const Loading = ({
  size = 8,
  sizeUnit = 'vw',
  color = 'rgb(41, 41, 41)',
  frontColor = 'rgb(41, 41, 41)',
  backColor = 'rgb(230, 207, 107)',
  loading = true,
  className = '',
  style = {},
  ...rest
}) => (
  <div style={style} className={cx({ Loading: true, [className]: Boolean(className) })}>
    <MetroSpinner
      size={size}
      sizeUnit={sizeUnit}
      color={color}
      frontColor={frontColor}
      backColor={backColor}
      loading={loading}
      {...rest}
    />
  </div>
)

export default Loading
