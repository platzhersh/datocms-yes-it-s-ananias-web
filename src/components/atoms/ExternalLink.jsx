import React from 'react'

export const ExternalLink = (props) => {
  const { url, children } = props
  return (
    <a href={url} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  )
}
