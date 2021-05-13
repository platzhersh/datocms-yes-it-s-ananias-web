import React from 'react'
import styled from 'styled-components/macro'

const StyledIframe = styled.iframe`
    width: 100%;
    overflow: hidden;
    background: transparent;
    border: none;
`

const Home = props => {
  return (
    <>
      {/* <StyledIframe
            allow="autoplay *; encrypted-media *; fullscreen *"
            frameborder="0"
            height="150"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src="https://embed.music.apple.com/us/album/to-venus-and-back-live/1539928223?i=1539928224">
        </StyledIframe> */}

      <StyledIframe src='https://open.spotify.com/embed/artist/1OakuD8h6abwYdcEVCs4Hv' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media' />
    </>
  )
}

export default Home
