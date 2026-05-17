import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default () => (
  <p>
    <a href='mailto:booking@yesitsananias.com'>
      <FontAwesomeIcon icon={faEnvelope} /> booking@yesitsananias.com
    </a>
  </p>
)
