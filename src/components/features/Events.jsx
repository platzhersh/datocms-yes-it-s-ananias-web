import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import EventListItem from '../molecules/EventListItem'
import { LoadingPlaceholder } from '../atoms/LoadingPlaceholder/LoadingPlaceholder'
import { ErrorMessage } from '../atoms/ErrorMessage/ErrorMessage'

const eventsQuery = gql`
  query EventsQuery {
    allEvents(orderBy: date_DESC) {
      id
      title
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
      time
      venueName
      venueUrl
    }
  }
`
const Events = (props) => {
  return (
    <Query query={eventsQuery}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingPlaceholder />
        if (error) return <ErrorMessage error={error} />

        return (
          <section>
            <h1>Events</h1>
            <div>
              {data.allEvents.map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
            </div>
          </section>
        )
      }}
    </Query>
  )
}

export default Events
