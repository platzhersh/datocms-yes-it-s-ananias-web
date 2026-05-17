import React from 'react'
import styled from 'styled-components'
import { ActionButton } from '../../atoms/ActionButton/ActionButton'
import { ExternalLink } from '../../atoms/ExternalLink'

const SocialMediaLinkText = styled.span`
  ${({ showTextOnMobile }) =>
    showTextOnMobile
      ? ''
      : `@media (max-width: 500px) {
          display: none;
        }`}
`

export const ActionButtonMediaLink = (props) => {
  const {
    url,
    icon,
    variant,
    linkText,
    inverse,
    showTextOnMobile
  } = props
  return (
    <ExternalLink url={url}>
      <ActionButton
        variant={variant}
        inverse={inverse}
        text={
          <>
            <span>{icon}</span>{' '}
            <SocialMediaLinkText showTextOnMobile={showTextOnMobile}>
              {linkText}
            </SocialMediaLinkText>
          </>
        }
      />
    </ExternalLink>
  )
}
