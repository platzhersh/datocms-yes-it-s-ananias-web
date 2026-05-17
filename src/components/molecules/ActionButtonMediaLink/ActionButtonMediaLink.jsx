import React from 'react'
import styled from 'styled-components'
import { ActionButton } from '../../atoms/ActionButton/ActionButton'
import { ExternalLink } from '../../atoms/ExternalLink'

const SocialMediaLinkText = styled.span`
  ${({ showTextOnMobile }) =>
    showTextOnMobile
      ? ''
      : `@media (max-width: 500px) {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }`}
`

export const ActionButtonMediaLink = (props) => {
  const { url, icon, variant, linkText, inverse, showTextOnMobile } = props
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
