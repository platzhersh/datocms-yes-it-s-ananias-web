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
  font-size: ${({ size }) => (size && size === 'big' ? '1.2em' : '1em')};
  background: ${({ theme }) => theme.colors.highlightPrimary};
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`

const SpotifyButton = styled(StyledButton)`
  background: ${({ theme }) => theme.colors.spotifyGreenRegular};
`

const BandcampButton = styled(StyledButton)`
  background: orange;
`

const YoutubeButton = styled(StyledButton)`
  background: ${({ theme }) => theme.colors.red.regular};
`

export const ActionButton = (props) => {
  const { text, variant } = props
  switch (variant) {
    case 'spotify':
      return <SpotifyButton>{text}</SpotifyButton>
    case 'bandcamp':
      return <BandcampButton>{text}</BandcampButton>
    case 'youtube':
      return <YoutubeButton>{text}</YoutubeButton>
    default:
      return <StyledButton {...props}>{text}</StyledButton>
  }
}
