import React from 'react'
import { ActionButtonMediaLink } from './ActionButtonMediaLink'

export const YoutubeLink = (props) => {
  const { url, inverse } = props
  return (
    <ActionButtonMediaLink
      url={url}
      inverse={inverse}
      iconName="youtube"
      variant="youtube"
      linkText="Watch Musicvideo"
    />
  )
}
