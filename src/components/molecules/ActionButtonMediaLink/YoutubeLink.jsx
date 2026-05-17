import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { ActionButtonMediaLink } from './ActionButtonMediaLink'

export const YoutubeLink = (props) => {
  const { url, inverse } = props
  return (
    <ActionButtonMediaLink
      url={url}
      inverse={inverse}
      icon={<FontAwesomeIcon icon={faYoutube} />}
      variant='youtube'
      linkText='Watch Musicvideo'
    />
  )
}
