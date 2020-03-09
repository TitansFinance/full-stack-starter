import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import { path, pathOr } from 'ramda'
import { MdLock, MdMonetizationOn } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import Button from '@/components/Button'
import Card from '@/components/Card'
import { Carousel, Slider, Slide, DotGroup } from '@/components/Carousel'

import './FundsCarousel.sass'


const FundsCarousel = ({ funds }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={t('FundsCarousel.title')}
      className="FundsCarousel"
    >
      <Carousel orientation={'row'}>
        <Slider>
          {funds.map((fund, index) => {
            const description = pathOr(null, ['details', 'description'], fund)
            return (
              <Slide index={index} key={index}>
                <div className="FundsCarouselSlide">
                  <div className="FundsCarouselAUM">10000 AUM</div>
                  <div className="FundsCarouselLongName">AmberAI Fixed Income 6 Months BTC Fund</div>
                  <div>Minimum <MdLock /> 6 months <MdMonetizationOn /> 10+</div>
                  {description ? (
                    <div className="FundsCarouselDescription" dangerouslySetInnerHTML={{ __html: description }}></div>
                  ) : null}
                  <div className="FundsCarouselBuy">
                    <Button className="FundsCarouselBuyButton"
                      onClick={() => {
                        console.log('on buy click', fund)
                      }}
                    >{t('FundsCarousel.BUY')}</Button>
                  </div>
                </div>
              </Slide>
            )
          })}
        </Slider>
        <DotGroup />
      </Carousel>
    </Card>
  )
}


export default FundsCarousel
