import React from 'react'
import styled from 'styled-components'
import { SpotifyLink } from '../ActionButtonMediaLink/SpotifyLink'
import { ItemContainer } from '../../atoms/ItemContainer/ItemContainer'

const SpotifyContainer = styled(ItemContainer)`
  border: 3px solid ${({ theme }) => theme.colors.spotifyGreenRegular};
`

const StyledIframe = styled.iframe`
  width: 100%;
  overflow: hidden;
  background: transparent;
  border: none;
  margin-bottom: 1em;
`
export const SpotifyEmbed = (props) => {
  return (
    <>
      <SpotifyContainer>
        <StyledIframe
          src="https://open.spotify.com/embed/artist/1OakuD8h6abwYdcEVCs4Hv"
          height="380"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
        />
        <SpotifyLink
          url="https://open.spotify.com/artist/1OakuD8h6abwYdcEVCs4Hv"
          text="Yes It's Ananias on Spotify"
        />
      </SpotifyContainer>
    </>
  )
}
