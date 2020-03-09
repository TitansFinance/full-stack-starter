import React, { useRef, useEffect } from 'react'
import cx from 'classnames'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { path } from 'ramda'
import { Link, withRouter } from 'react-router-dom'
import { MdAccountCircle, MdAddAPhoto } from 'react-icons/md'
import Loading from '@/components/Loading'

import './CurrentUserImage.sass'


const CurrentUserImage = ({
  data,
  className,
  editable = false,
  mutate,
  size = 50,
  isLink = true,
  history,
}) => {
  if (data.error) console.error('error')
  if (data.loading) return <Loading />
  const canvasRef = useRef(null)
  const profileImageUrl = path(['me', 'profileImageUrl'], data)

  useEffect(() => {
    console.log(canvasRef)
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.height = size // this.width
      canvas.width = size // this.height
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = function() {
        ctx.drawImage(img, 0, 0, size, size)
        canvas.style.visibility = 'visible'
      }
      img.src = profileImageUrl || '/static/images/profile-blank@2x.png'
    }
  }, [profileImageUrl])


  const handleChange = ({
    target,
  }) => {
    if (!editable) return
    const {
      validity,
      files: [file],
    } = target

    console.log(file)
    const img = new Image()
    img.onload = function draw() {
      console.log(this)
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      canvas.height = size // this.width
      canvas.width = size // this.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(this, 0, 0, size, size)
      crop(canvas, img)
      ctx.canvas.toBlob((blob) => {
        const canvasFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        })
        validity.valid && mutate({
          variables: { file: canvasFile },
          refetchQueries: ({ data }) => {
            console.log('data: ', data)
            return [{
              query: gql`{
                me { id profileImageUrl }
              }`,
              fetchPolicy: 'network-only',
            }]
          },
          awaitRefetchQueries: true,
        })
      }, file.type, 1)
    }
    img.onerror = function failed () {
      console.error('The provided file couldn\'t be loaded as an Image media')
    }

    img.src = URL.createObjectURL(file)
  }

  return (
    <div className={cx({ CurrentUserImage: true }, (className || ''))} onClick={() => {
      if (isLink) history.push('/settings/user/profile')
    }}>
      <div className="CurrentUserImageEditableCanvas" style={{ height: `${size}px` }}>
        <canvas style={{ visibility: 'hidden' }} ref={canvasRef} className="CurrentUserImageCanvas" />
        {editable ? <label htmlFor="browse" className="CurrentUserImageLabel">
          <MdAddAPhoto className="CurrentUserImageUpload" />
        </label> : null}
        {editable ? <input id="browse" type="file" required onChange={handleChange} style={{ display: 'none' }}/> : null}
      </div>
    </div>
  )
}

function crop(canvas, img) {
  const ctx = canvas.getContext('2d')
  const cw = canvas.width
  const ch = canvas.height
  ctx.drawImage(img, 0, 0, cw, ch)
  ctx.globalCompositeOperation='destination-in'
  ctx.beginPath()
  ctx.arc(cw/2, ch/2, ch/2, 0, Math.PI*2)
  ctx.closePath()
  ctx.fill()
}

export default compose(
  graphql(gql`{
    me {
      id
      profileImageUrl
    }
  }`),
  graphql(gql`
    mutation($file: Upload!) {
      uploadProfileImage(file: $file) {
        profileImageUrl
      }
    }
  `)
)(withRouter(CurrentUserImage))
