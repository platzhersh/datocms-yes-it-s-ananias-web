import React, { useEffect, useRef, useState } from 'react'
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

const IframeSlot = styled.div`
  width: 100%;
  height: 380px;
  margin-bottom: 1em;
`

export const SpotifyEmbed = () => {
  const slotRef = useRef(null)
  const [shouldMount, setShouldMount] = useState(false)

  useEffect(() => {
    if (shouldMount) return
    const node = slotRef.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setShouldMount(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [shouldMount])

  return (
    <SpotifyContainer>
      {shouldMount ? (
        <StyledIframe
          title="Yes It's Ananias on Spotify"
          src='https://open.spotify.com/embed/artist/1OakuD8h6abwYdcEVCs4Hv'
          height='380'
          loading='lazy'
          frameBorder='0'
          allowtransparency='true'
          allow='encrypted-media'
          sandbox='allow-same-origin allow-scripts'
        />
      ) : (
        <IframeSlot ref={slotRef} aria-hidden='true' />
      )}
      <SpotifyLink
        url='https://open.spotify.com/artist/1OakuD8h6abwYdcEVCs4Hv'
        text="Yes It's Ananias on Spotify"
      />
    </SpotifyContainer>
  )
}
