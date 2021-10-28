import React from 'react'
import styled from 'styled-components/macro'
import UpcomingEvents from '../molecules/UpcomingEvents'

const StyledIframe = styled.iframe`
    width: 100%;
    overflow: hidden;
    background: transparent;
    border: none;
`

const EventsContainer = styled.div`
  margin-bottom: 40px;
`;

const Home = props => {
  return (<>
    <EventsContainer>
      <UpcomingEvents />
      </EventsContainer>
      <StyledIframe src='https://open.spotify.com/embed/artist/1OakuD8h6abwYdcEVCs4Hv' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media' />
    </>)
  
}

export default Home
