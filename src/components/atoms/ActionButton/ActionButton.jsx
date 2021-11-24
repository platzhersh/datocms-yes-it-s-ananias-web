import React from 'react'
import styled from 'styled-components/macro'

const StyledButton = styled.button`
  width: auto;
  border-radius: 500px;
  display: inline-block;
  margin: auto;
  padding: 1em 2em;
  border: none;
  color: ${({ theme, inverse }) =>
    inverse ? theme.colors.highlightPrimary : 'black'};
  font-size: ${({ size }) => (size && size === 'big' ? '1.2em' : '1em')};
  background: ${({ theme, inverse }) =>
    inverse ? 'black' : theme.colors.highlightPrimary};
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`

const SpotifyButton = styled(StyledButton)`
  color: ${({ theme, inverse }) =>
    inverse ? theme.colors.spotifyGreenRegular : 'black'};
  background: ${({ theme, inverse }) =>
    inverse ? 'black' : theme.colors.spotifyGreenRegular};
`

const BandcampButton = styled(StyledButton)`
  color: ${({ theme, inverse }) => (inverse ? 'orange' : 'black')};
  background: ${({ theme, inverse }) => (inverse ? 'black' : 'orange')};
`

const YoutubeButton = styled(StyledButton)`
  color: ${({ theme, inverse }) =>
    inverse ? theme.colors.red.regular : 'black'};
  background: ${({ theme, inverse }) =>
    inverse ? 'black' : theme.colors.red.regular};
`

const PurchaseButton = styled(StyledButton)`
  font-weight: bold;
  color: ${({ theme, inverse }) =>
    inverse ? theme.colors.purchaseAction : 'whitesmoke'};
  background: ${({ theme, inverse }) =>
    inverse ? 'black' : theme.colors.purchaseAction};
`

export const ActionButton = (props) => {
  const { text, variant, inverse } = props
  switch (variant) {
    case 'spotify':
      return <SpotifyButton inverse={inverse}>{text}</SpotifyButton>
    case 'bandcamp':
      return <BandcampButton inverse={inverse}>{text}</BandcampButton>
    case 'youtube':
      return <YoutubeButton inverse={inverse}>{text}</YoutubeButton>
    case 'purchase':
      return <PurchaseButton inverse={inverse}>{text}</PurchaseButton>
    default:
      return <StyledButton {...props}>{text}</StyledButton>
  }
}
