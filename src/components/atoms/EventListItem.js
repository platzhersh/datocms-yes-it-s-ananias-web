import React from 'react'
import styled from 'styled-components/macro'

const StyledEventListItem = styled.div`
  display: flex;
  flex-wrap: wrap;

  border: 3px solid #de6d2c;
`;

const StyledAlbumDescription = styled.div`
    flex: 1 1 auto;
`

export default props => {
  const { event } = props
  const date = event.date ? new Date(event.date) : undefined;
  const formattedDate = date ? date.toLocaleDateString() : '';

  return <StyledEventListItem key={event.id}>
        <StyledAlbumDescription>
      <h2>{event.title}</h2>
      <p>{formattedDate}</p>
      {event.venueUrl ? <p><a href={event.venueUrl}>{event.venueName}</a></p> : <p>{event.venueName}</p>}
      <p>Doors: {event.time}</p>

      {event.eventUrl && <p><a href={event.eventUrl}>{event.eventUrlText ?? 'Event Details'}</a></p>}
    </StyledAlbumDescription>
  </StyledEventListItem>
}
