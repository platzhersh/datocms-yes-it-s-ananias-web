import React from 'react'
import { ActionButtonMediaLink } from './ActionButtonMediaLink'

export const SpotifyLink = (props) => {
  const { url } = props
  return (
    <ActionButtonMediaLink
      url={url}
      iconClassName="fab fa-spotify"
      variant="spotify"
      linkText="Listen on Spotify"
    />
  )
}
