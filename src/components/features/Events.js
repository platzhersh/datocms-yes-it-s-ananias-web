import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import styled from 'styled-components/macro'

const eventsQuery = gql`

query EventsQuery {
  allEvents {
    date
    description {
      value
    }
    eventUrl
    id
    title
    time
    venueName
    venueUrl
  }
}

`

const StyledEventListItem = styled.div`
  display: flex;
  flex-wrap: wrap;

  border: 3px solid #de6d2c;
`;


const StyledAlbumDescription = styled.div`
    flex: 1 1 auto;
`

const Events = props => {
    return (
        <Query query={eventsQuery}>
            {({ data, loading, error }) => {
                if (loading) return 'Loading...'
                if (error) return `ERROR: ${error}`

                console.log(data);

                return (
                    <section>
                        <h1>Events</h1>
                        <div>
                            {data.allEvents.map(event => (
                                <StyledEventListItem key={event.id}>
                                    {/* <CoverImageContainer>
                                        {release.cover && <Image data={release.cover.responsiveImage} />}
                                    </CoverImageContainer> */}
                                    <StyledAlbumDescription>
                                        <h2>{event.title}</h2>
                                        <p>Date: {event.date}</p>
                                        <p>Location: {event.venueName}</p>
                                        <p>Doors: {event.time}</p>
                                    </StyledAlbumDescription>
                                </StyledEventListItem>
                            ))}
                        </div>
                    </section>
                )
            }}
        </Query>
    )
}

export default Events

