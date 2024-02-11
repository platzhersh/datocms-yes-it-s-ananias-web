import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";
import { VideoFragment } from "../../queries/fragments/VideoFragment";
import { ErrorMessage } from "../atoms/ErrorMessage/ErrorMessage";
import { LoadingPlaceholder } from "../atoms/LoadingPlaceholder/LoadingPlaceholder";
import { VideoCard } from "../molecules/VideoCard/VideoCard";

const videosQuery = gql`
  query VideosQuery {
    allVideos(orderBy: listposition_ASC) {
     ${VideoFragment}
    }
  }
`;

const Videos = (props) => {
  return (
    <Query query={videosQuery}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingPlaceholder />;
        if (error) return <ErrorMessage error={error} />;

        return (
          <>
            <section>
              <div>
                {data.allVideos.map((video) => (
                  <VideoCard video={video} />
                ))}
              </div>
            </section>
          </>
        );
      }}
    </Query>
  );
};

export default Videos;
