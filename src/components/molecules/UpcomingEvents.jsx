import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import EventListItem from './EventListItem'
import { LoadingPlaceholder } from '../atoms/LoadingPlaceholder/LoadingPlaceholder'
import { ErrorMessage } from '../atoms/ErrorMessage/ErrorMessage'

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
const UpcomingEvents = (props) => {
  return (
    <Query query={eventsQuery}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingPlaceholder />
        if (error) return <ErrorMessage error={error} />

        const upcomingEvents = data.allEvents.filter((event) => {
          if (!event.date) return false
          const date = new Date(event.date)
          const today = new Date()

          if (date.getFullYear() < today.getFullYear()) {
            return false
          }
          if (date.getFullYear() === today.getFullYear()) {
            if (date.getMonth() < today.getMonth()) return false
            if (date.getMonth() === today.getMonth()) {
              if (date.getDate() < today.getDate()) return false
            }
          }

          return true
        })

        return (
          upcomingEvents &&
          upcomingEvents.length > 0 && (
            <section>
              <h1>Upcoming Shows</h1>
              <div>
                {upcomingEvents.map((event) => (
                  <EventListItem key={event.id} event={event} />
                ))}
              </div>
            </section>
          )
        )
      }}
    </Query>
  )
}

export default UpcomingEvents
