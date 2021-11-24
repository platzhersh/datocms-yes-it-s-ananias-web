import React from 'react'
import styled from 'styled-components/macro'
import { ActionButton } from '../../atoms/ActionButton/ActionButton'
import { ExternalLink } from '../../atoms/ExternalLink'

const SocialMediaLinkIcon = styled.span``

const SocialMediaLinkText = styled.span`
  @media (max-width: 500px) {
    display: none;
  }
`

export const ActionButtonMediaLink = (props) => {
  const { url, iconClassName, variant, linkText, inverse } = props
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
            <SocialMediaLinkText>{linkText}</SocialMediaLinkText>
          </>
        }
      ></ActionButton>
    </ExternalLink>
  )
}
