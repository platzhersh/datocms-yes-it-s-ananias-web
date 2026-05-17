import React from 'react'
import { gql } from '@apollo/client'
import groupBy from 'lodash/groupBy'
import { DateTime } from 'luxon'
import { EventListItem } from './EventListItem'
import { QueryLoader } from '../organisms/QueryLoader/QueryLoader'

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
    const date = new Date(event.date)
    const today = new Date()

    if (date.getFullYear() < today.getFullYear()) {
      return acc
    }
    if (date.getFullYear() === today.getFullYear()) {
      if (date.getMonth() < today.getMonth()) return acc
      if (date.getMonth() === today.getMonth()) {
        if (date.getDate() < today.getDate()) return acc
      }
    }

    acc.push({ ...event, date: DateTime.fromSQL(event.date, { zone: 'utc' }) })
    return acc
  }, [])
}

const UpcomingEvents = () => (
  <QueryLoader
    query={eventsQuery}
    successCallback={(data) => {
      const upcomingEvents = filterUpcomingEvents(data)
      const groupedByYear = Object.entries(
        groupBy(upcomingEvents, (event) => event.date.year)
      )

      if (groupedByYear.length === 0) return null

      return (
        <section>
          <h1>Upcoming Shows</h1>
          <div>
            {groupedByYear.map(([year, events]) => (
              <React.Fragment key={year}>
                <h2>{year}</h2>
                {events.map((event) => (
                  <EventListItem key={event.id} event={event} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
      )
    }}
  />
)

export default UpcomingEvents
