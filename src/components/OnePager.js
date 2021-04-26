import React from 'react'
import styled from 'styled-components/macro'
import Contact from './molecules/Contact'

const StyledIframge = styled.iframe`
    width: 100%;
    overflow: hidden;
    background: transparent;
    border: none;
`

const OnePager = props => {
  return (
    <>
      <Contact />
      <StyledIframge
        allow='autoplay *; encrypted-media *; fullscreen *'
        frameborder='0'
        height='150'
        sandbox='allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation'
        src='https://embed.music.apple.com/us/album/to-venus-and-back-live/1539928223?i=1539928224'
      />
    </>
  )
}

export default OnePager
