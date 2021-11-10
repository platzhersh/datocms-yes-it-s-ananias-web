import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import EventListItem from '../molecules/EventListItem'

const eventsQuery = gql`

query EventsQuery {
  allEvents(orderBy: date_ASC) {
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
const Events = props => {
  return (
    <Query query={eventsQuery}>
            {({data, loading, error}) => {
      if (loading) return 'Loading...'
      if (error) return `ERROR: ${error}`

      return (
        <section>
                        <h1>Events</h1>
                        <div>
                            {data.allEvents.map(event => (
          <EventListItem event={event} />
        ))}
                        </div>
                    </section>
      )
    }}
        </Query>
  )
}

export default Events
