import React from 'react'
import styled from 'styled-components'
import { ActionButton } from '../../atoms/ActionButton/ActionButton'
import { ExternalLink } from '../../atoms/ExternalLink'

const SocialMediaLinkIcon = styled.span``

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
    iconClassName,
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
            <SocialMediaLinkIcon>
              <i className={iconClassName} />
            </SocialMediaLinkIcon>{' '}
            <SocialMediaLinkText showTextOnMobile={showTextOnMobile}>
              {linkText}
            </SocialMediaLinkText>
          </>
        }
      />
    </ExternalLink>
  )
}
