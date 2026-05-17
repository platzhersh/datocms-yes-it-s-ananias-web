import React from 'react'
import styled from 'styled-components'

const SocialMediaLinkText = styled.span`
  @media (max-width: 500px) {
    display: none;
  }
`

export default (props) => {
  const { url, linkText, icon } = props
  return (
    <a href={url} rel='noopener noreferrer' target='_blank' title={linkText}>
      <span>{icon}</span>{' '}
      <SocialMediaLinkText>{linkText}</SocialMediaLinkText>
    </a>
  )
}
