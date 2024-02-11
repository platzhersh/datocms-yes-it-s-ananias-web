import { DateTime } from 'luxon'
import React from 'react'
import styled from 'styled-components'
import { ItemContainer } from '../atoms/ItemContainer/ItemContainer'
import { Image } from 'react-datocms'
import { StructuredText } from 'react-datocms'
import { ExternalLink } from '../atoms/ExternalLink'
import { ActionButton } from '../atoms/ActionButton/ActionButton'
import { EventItem } from '../../models/eventItem'

const StyledEventListItem = styled(ItemContainer)`
  display: flex;
  flex-wrap: wrap;
` as any

const StyledAlbumDescription = styled.div`
  flex: 1 1 auto;
`

const EventTimeAndLocation = styled.p`
  span:nth-child(2n) {
    margin-left: 24px;
  }
`

const CoverImageContainer = styled.div`
  flex: 0 0 300px;
  width: 300px;
  height: auto;
  max-width: 100%;
`
type EventListItemProps = {
  event: EventItem
 };

export const EventListItem = (props: EventListItemProps) => {
  const { event } = props
  const date = event.date ? DateTime.fromSQL(event.date, { zone: "utc"}) : undefined
  const formattedDate = date
    ? `${date.toLocaleString({
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      })}`
    : ''

  return (
    <StyledEventListItem key={event.id}>
      <CoverImageContainer>
        {event.flyer && <Image data={event.flyer.responsiveImage as any} />}
      </CoverImageContainer>
      <StyledAlbumDescription>
        <p>{formattedDate}</p>
        <h2>{event.title}</h2>
        <EventTimeAndLocation>
          {event.venueUrl ? (
            <span title="Location">
              <i className="fas fa-map-marker-alt"></i>{' '}
              <a
                href={event.venueUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {event.venueName}
              </a>
            </span>
          ) : (
            <span title="Location">
              <i className="fas fa-map-marker-alt"></i> {event.venueName}
            </span>
          )}
          <span title="Show start">
            <i className="far fa-clock"></i> {event.time}
          </span>
        </EventTimeAndLocation>
        {event.eventUrl && (
          <ExternalLink url={event.eventUrl}>
            <ActionButton text={event.eventUrlText} />
          </ExternalLink>
        )}

        {event.description && (
          <div>
            <StructuredText data={event.description.value} />
          </div>
        )}
      </StyledAlbumDescription>
    </StyledEventListItem>
  )
}
