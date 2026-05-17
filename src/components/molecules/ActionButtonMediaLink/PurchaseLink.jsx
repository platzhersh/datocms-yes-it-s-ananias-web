import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons'
import { ActionButtonMediaLink } from './ActionButtonMediaLink'

export const PurchaseLink = (props) => {
  const { url, text, inverse } = props
  return (
    <ActionButtonMediaLink
      url={url}
      inverse={inverse}
      showTextOnMobile
      variant='purchase'
      icon={<FontAwesomeIcon icon={faBasketShopping} />}
      linkText={text}
    />
  )
}
