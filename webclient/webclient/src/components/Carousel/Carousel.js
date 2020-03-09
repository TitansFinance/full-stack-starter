import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import { path, pathOr } from 'ramda'

const CarouselContext = React.createContext({ width: 0 })

import './Carousel.sass'

export const Dot = ({
  className = '',
  onClick = () => ({}),
  index = null,
  active = false,
  children = null,
  ...rest
}) => {
  return (
    <div
      className={cx({ Dot: true, DotActive: active, [className]: Boolean(className) })}
      onClick={(e) => onClick(e, index, active)}
      {...rest}>
      {children}
    </div>
  )
}
export const DotGroup = ({
  activeIndex = 0,
  className = '',
  children = null,
  slides = [],
  onClick = () => ({}),
  ...rest
}) => {
  return (
    <div className={cx({ DotGroup: true, [className]: Boolean(className) })} {...rest}>
      {slides.map((slide, i) => (
        <Dot
          key={i}
          active={i === activeIndex}
          index={i}
          onClick={(e, index, active) => onClick(e, index, active)}
        />
      ))}
      {children}
    </div>
  )
}

export const Slider = ({
  className = '',
  children = null,
  ...rest
}) => {
  return (
    <CarouselContext.Consumer>
      {({
        width,
        activeIndex,
      }) => (
        <div className={cx({ Slider: true, [className]: Boolean(className) })} style={{
          width: `${100 * (children && children.length || 1)}%`,
          transform: `translate(${(-1 * width) * activeIndex}px, ${0})`,
        }} {...rest}>
          {children}
        </div>
      )}
    </CarouselContext.Consumer>
  )
}

export const Slide = ({
  className = '',
  children = null,
  style = {},
  ...rest
}) => {
  return (
    <CarouselContext.Consumer>
      {({ width }) => (
        <div
          className={cx({ Slide: true, [className]: Boolean(className) })}
          style={Object.assign({}, style, { width })} {...rest}
        >
          {children}
        </div>
      )}
    </CarouselContext.Consumer>
  )
}

export const Carousel = ({
  className = '',
  children = null,
  defaultActiveIndex = 0,
  ...rest
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex)
  const [width, setWidth] = useState(0)
  const carousel = useRef(null)
  const slides = path(['props', 'children'], children[0])

  useEffect(() => {
    setWidth(pathOr(0, ['current', 'clientWidth'], carousel))
  }, [width])

  let indicators = null
  if ((children[0] && children[0].length > 1) && children[1]) {
    const Indicators = children[1].type
    indicators = (
      <Indicators
        {...Object.assign({}, children[1].props, {
          slides,
          activeIndex,
          onClick: (e, index, active) => {
            setActiveIndex(index)
            if (children[1].props.onClick) children[1].props.onClick(index)
          },
        })}
      />
    )
  }

  return (
    <CarouselContext.Provider value={{
      width,
      activeIndex,
    }}>
      <div className="CarouselWrapper">
        <div
          ref={carousel}
          className={cx({ Carousel: true, [className]: Boolean(className) })}
          {...rest}
        >
          {children[0]}
        </div>
        {indicators}
      </div>
    </CarouselContext.Provider>
  )
}

export default Carousel
