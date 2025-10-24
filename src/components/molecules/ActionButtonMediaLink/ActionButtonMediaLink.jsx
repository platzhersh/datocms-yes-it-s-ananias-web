import React from 'react'
import styled from 'styled-components'
import { ActionButton } from '../../atoms/ActionButton/ActionButton'
import { ExternalLink } from '../../atoms/ExternalLink'
import { Icon } from '../../atoms/Icon'

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
    iconName,
    variant,
    linkText,
    inverse,
    showTextOnMobile,
  } = props
  return (
    <ExternalLink url={url}>
      <ActionButton
        variant={variant}
        inverse={inverse}
        text={
          <>
            <SocialMediaLinkIcon>
              <Icon name={iconName} size={16} />
            </SocialMediaLinkIcon>{' '}
            <SocialMediaLinkText showTextOnMobile={showTextOnMobile}>
              {linkText}
            </SocialMediaLinkText>
          </>
        }
      ></ActionButton>
    </ExternalLink>
  )
}
