import React from 'react'
import styled from 'styled-components/macro'

const SocialMediaLinkA = styled.a``

const SocialMediaLinkIcon = styled.span`
  color: rgb(30, 215, 96);
`

const SocialMediaLinkText = styled.span`
  @media (max-width: 500px) {
    display: none;
  }
`

export default (props) => {
  const { url } = props
  return (
    <SocialMediaLinkA href={url} rel="noopener noreferrer" target="_blank">
      <SocialMediaLinkIcon>
        <i className="fab fa-spotify" />
      </SocialMediaLinkIcon>{' '}
      <SocialMediaLinkText>Auf Spotify anhören</SocialMediaLinkText>
    </SocialMediaLinkA>
  )
}
