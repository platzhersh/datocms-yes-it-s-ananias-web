import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { EventListItem } from "./EventListItem";
import { LoadingPlaceholder } from "../atoms/LoadingPlaceholder/LoadingPlaceholder";
import { ErrorMessage } from "../atoms/ErrorMessage/ErrorMessage";
import _ from "lodash";
import { DateTime } from "luxon";

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
`;

const filterUpcomingEvents = (data) => {
  return data.allEvents.reduce((acc, event) => {
    if (!event.date) return acc;
    const date = new Date(event.date);
    const today = new Date();

    if (date.getFullYear() < today.getFullYear()) {
      return acc;
    }
    if (date.getFullYear() === today.getFullYear()) {
      if (date.getMonth() < today.getMonth()) return acc;
      if (date.getMonth() === today.getMonth()) {
        if (date.getDate() < today.getDate()) return acc;
      }
    }

    // parse date and add to accumulator
    acc.push({ ...event, date: DateTime.fromSQL(event.date, { zone: "utc" }) });
    return acc;
  }, []);
};

const UpcomingEvents = (props) => {
  return (
    <Query query={eventsQuery}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingPlaceholder />;
        if (error) return <ErrorMessage error={error} />;

        const upcomingEvents = filterUpcomingEvents(data);
        const groupedByYear = Object.entries(
          _.groupBy(upcomingEvents, (event) => event.date.year)
        );

        return (
          groupedByYear &&
          groupedByYear.length > 0 && (
            <section>
              <h1>Upcoming Shows</h1>
              <div>
                {groupedByYear.map((eventGroup) => (
                  <>
                    <h2>{eventGroup[0]}</h2>
                    {eventGroup[1].map((event) => (
                      <EventListItem key={event.id} event={event} />
                    ))}
                  </>
                ))}
              </div>
            </section>
          )
        );
      }}
    </Query>
  );
};

export default UpcomingEvents;
