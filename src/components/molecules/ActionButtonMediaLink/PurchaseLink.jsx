import React from 'react'
import { ActionButtonMediaLink } from './ActionButtonMediaLink'

export const PurchaseLink = (props) => {
  const { url, text, inverse } = props
  return (
    <ActionButtonMediaLink
      url={url}
      inverse={inverse}
      showTextOnMobile={true}
      variant="purchase"
      iconClassName="fas fa-shopping-basket"
      linkText={text}
    />
  )
}
