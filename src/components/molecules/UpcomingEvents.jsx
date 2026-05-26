import React from 'react'
import { gql } from '@apollo/client'
import groupBy from 'lodash/groupBy'
import { DateTime } from 'luxon'
import { EventListItem } from './EventListItem'
import { QueryLoader } from '../organisms/QueryLoader/QueryLoader'
import { FadeInStagger } from '../atoms/FadeIn/FadeIn'

const eventsQuery = gql`
  query EventsQuery {
    allEvents(orderBy: date_ASC, first: 100) {
      date
      flyer {
        responsiveImage {
          alt
          aspectRatio
          base64
          bgColor
          height
          sizes
          src
          srcSet
          webpSrcSet
          width
          title
        }
      }
      description {
        value
      }
      eventUrl
      eventUrlText
      id
      title
      time
      venueName
      venueUrl
    }
  }
`

const filterUpcomingEvents = (data) => {
  return data.allEvents.reduce((acc, event) => {
    if (!event.date) return acc
    const date = DateTime.fromISO(event.date, { zone: 'utc' })
    const today = DateTime.utc().startOf('day')

    if (date < today) return acc

    acc.push({ ...event, date })
    return acc
  }, [])
}

const UpcomingEvents = () => (
  <QueryLoader
    query={eventsQuery}
    successCallback={(data) => {
      const upcomingEvents = filterUpcomingEvents(data)
      const groupedByYear = Object.entries(groupBy(upcomingEvents, (event) => event.date.year))

      if (groupedByYear.length === 0) return null

      return (
        <section>
          <h1>Upcoming Shows</h1>
          <FadeInStagger>
            {groupedByYear.map(([year, events]) => (
              <React.Fragment key={year}>
                <h2>{year}</h2>
                {events.map((event) => (
                  <EventListItem key={event.id} event={event} />
                ))}
              </React.Fragment>
            ))}
          </FadeInStagger>
        </section>
      )
    }}
  />
)

export default UpcomingEvents
