import React from 'react'
import { ActionButtonMediaLink } from './ActionButtonMediaLink'

export const SpotifyLink = (props) => {
  const { url, text, inverse } = props
  return (
    <ActionButtonMediaLink
      url={url}
      inverse={inverse}
      iconName="spotify"
      variant="spotify"
      linkText={text ?? 'Listen on Spotify'}
    />
  )
}
