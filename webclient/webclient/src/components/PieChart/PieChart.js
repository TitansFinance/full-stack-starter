import React from 'react'
import cx from 'classnames'

import './PieChart.sass'

const PieChart = ({ className, height, width, slices = [], children = null }) => {
  const slicesToRender = slices.map((slice, i) => {
    let rotate = -90
    if (i > 0) rotate = (rotate + ((slices.slice(0, i).reduce((a, b) => (a + b.percentage), 0) / 100) * 360))
    return {
      ...slice,
      rotate,
    }
  })

  return (
    <div className={cx({ PieChart: true, [className]: Boolean(className) })}>
      <svg className="circle-chart" viewBox="0 0 35.83098862 35.83098862" xmlns="http://www.w3.org/2000/svg">
        <circle className="circle-chart__background" stroke="#efefef" strokeWidth="0.5" fill="none" cx="17.91549431" cy="17.91549431" r="17.91549431" />
        <circle className="circle-chart__background" stroke="#efefef" strokeWidth="2" fill="none" cx="17.91549431" cy="17.91549431" r="15.91549431" />
        {slicesToRender.map((slice, i) => {
          return (
            <circle
              key={i}
              className="circle-chart__circle"
              stroke={slice.color}
              strokeWidth="2"
              strokeDasharray={`${slice.percentage},100`}
              style={{ transform: `rotate(${slice.rotate.toString()}deg)` }}
              fill="none"
              cx="17.91549431"
              cy="17.91549431"
              r="15.91549431"
            />
          )
        })}
        {children}
      </svg>
    </div>
  )
}

export default PieChart
