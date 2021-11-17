import React from 'react'
import { ActionButtonMediaLink } from './ActionButtonMediaLink'

export const YoutubeLink = (props) => {
  const { url } = props
  return (
    <ActionButtonMediaLink
      url={url}
      iconClassName="fab fa-youtube"
      variant="youtube"
      linkText="Watch Musicvideo"
    />
  )
}
