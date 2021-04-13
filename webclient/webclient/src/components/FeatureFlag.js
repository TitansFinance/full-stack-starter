import React from 'react'

export default ({ flag, children }) => {
  if (!flag) return null
  return <>{children}</>
}
