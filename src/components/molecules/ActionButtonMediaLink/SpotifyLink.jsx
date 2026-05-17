import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { ActionButtonMediaLink } from './ActionButtonMediaLink'

export const SpotifyLink = (props) => {
  const { url, text, inverse } = props
  return (
    <ActionButtonMediaLink
      url={url}
      inverse={inverse}
      icon={<FontAwesomeIcon icon={faSpotify} />}
      variant='spotify'
      linkText={text ?? 'Listen on Spotify'}
    />
  )
}
