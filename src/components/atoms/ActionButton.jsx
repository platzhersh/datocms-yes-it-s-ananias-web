import React from 'react'
import styled from 'styled-components/macro'

const StyledButton = styled.button`
  width: auto;
  border-radius: 500px;
  display: inline-block;
  margin: auto;
  padding: 1em 2em;
  border: none;
  color: black;
  font-size: 1.2em;
  background: ${({ theme }) => theme.colors.highlightPrimary};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.highlightSecondary};
  }
`

const SpotifyButton = styled(StyledButton)`
  background: ${({ theme }) => theme.colors.spotifyGreenRegular};
`

const BandcampButton = styled(StyledButton)`
  background: orange;
`

export default (props) => {
  const { text, variant } = props
  console.log('Variant', variant)
  switch (variant) {
    case 'spotify':
      return <SpotifyButton>{text}</SpotifyButton>
    case 'bandcamp':
      return <BandcampButton>{text}</BandcampButton>
    default:
      return <StyledButton>{text}</StyledButton>
  }
}
