import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import EventListItem from '../molecules/EventListItem'

const eventsQuery = gql`

query EventsQuery {
  allEvents(orderBy: date_ASC) {
    date
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

