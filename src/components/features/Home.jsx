import React from 'react'
import styled from 'styled-components'
import { SpotifyEmbed } from '../molecules/SpotifyEmbed/SpotifyEmbed'
import { FeaturedContent } from '../molecules/FeaturedContent/FeaturedContent'

import UpcomingEvents from '../molecules/UpcomingEvents'

const EventsContainer = styled.div`
  margin-bottom: 40px;
`

const Home = (props) => {
  return (
    <>
      <EventsContainer>
        <FeaturedContent />
        <UpcomingEvents />
      </EventsContainer>
      <SpotifyEmbed />
    </>
  )
}

export default Home
