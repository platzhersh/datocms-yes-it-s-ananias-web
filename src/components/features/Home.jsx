import React from 'react'
import styled from 'styled-components/macro'
import { SpotifyEmbed } from '../molecules/SpotifyEmbed/SpotifyEmbed'
import UpcomingEvents from '../molecules/UpcomingEvents'

const EventsContainer = styled.div`
  margin-bottom: 40px;
`

const Home = (props) => {
  return (
    <>
      <EventsContainer>
        <UpcomingEvents />
      </EventsContainer>
      <SpotifyEmbed />
    </>
  )
}

export default Home
