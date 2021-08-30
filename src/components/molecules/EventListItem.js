import { DateTime } from 'luxon';
import React from 'react'
import styled from 'styled-components/macro'
import ItemContainer from '../atoms/ItemContainer';


const StyledEventListItem = styled(ItemContainer)`
  display: flex;
  flex-wrap: wrap;

  border: 3px solid #de6d2c;
`;

const StyledAlbumDescription = styled.div`
    flex: 1 1 auto;
`

const EventTimeAndLocation = styled.p`
  span:nth-child(2n) {
    margin-left: 24px;
  }
`;

export default props => {
  const { event } = props
  const date = event.date ? new Date(event.date) : undefined;
  const dateTime = DateTime.fromJSDate(date);
  const formattedDate = dateTime ? `${dateTime.toLocaleString({ weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' })}` : '';

  return <StyledEventListItem key={event.id}>
    <StyledAlbumDescription>
      <p>{formattedDate}</p>
      <h2>{event.title}</h2>
      <EventTimeAndLocation>
        {event.venueUrl ? <span title="Location"><i className="fas fa-map-marker-alt"></i> <a href={event.venueUrl} rel="noopener noreferrer" target="_blank">{event.venueName}</a></span> : <span title="Location"><i className="fas fa-map-marker-alt"></i> {event.venueName}</span>}
        <span title="Show start"><i className="far fa-clock"></i> {event.time}</span>
      </EventTimeAndLocation>
      {event.eventUrl && <p title="More information"><i className="fas fa-external-link-alt"></i> <a href={event.eventUrl} rel="noopener noreferrer" target="_blank">{event.eventUrlText ?? 'Event Details'}</a></p>}
    </StyledAlbumDescription>
  </StyledEventListItem>
}
