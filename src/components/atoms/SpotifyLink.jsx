import React from 'react'
import styled from 'styled-components/macro'
import ActionButton from './ActionButton'

const SocialMediaLinkA = styled.a``

const SocialMediaLinkIcon = styled.span``

const SocialMediaLinkText = styled.span`
  @media (max-width: 500px) {
    display: none;
  }
`

export default (props) => {
  const { url } = props
  return (
    <SocialMediaLinkA href={url} rel="noopener noreferrer" target="_blank">
      <ActionButton
        variant="spotify"
        text={
          <>
            <SocialMediaLinkIcon>
              <i className="fab fa-spotify" />
            </SocialMediaLinkIcon>{' '}
            <SocialMediaLinkText>Listen on Spotify</SocialMediaLinkText>
          </>
        }
      ></ActionButton>
    </SocialMediaLinkA>
  )
}
