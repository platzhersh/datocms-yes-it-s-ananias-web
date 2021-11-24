import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import YouTubeVideo from '../atoms/YouTubeVideo'
import styled from 'styled-components/macro'
import { ItemContainer } from '../atoms/ItemContainer/ItemContainer'
import { LoadingPlaceholder } from '../atoms/LoadingPlaceholder/LoadingPlaceholder'
import { ErrorMessage } from '../atoms/ErrorMessage/ErrorMessage'

const videosQuery = gql`
  query VideosQuery {
    allVideos(orderBy: listposition_ASC) {
      title
      id
      listposition
      videourl {
        width
        url
        title
        thumbnailUrl
        providerUid
        provider
        height
      }
    }
  }
`

const VideoWrapper = styled(ItemContainer)``

const Videos = (props) => {
  return (
    <Query query={videosQuery}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingPlaceholder />
        if (error) return <ErrorMessage error={error} />

        return (
          <section>
            <div>
              {data.allVideos.map((video) => (
                <VideoWrapper key={video.id}>
                  <h3>{video.title}</h3>
                  <div>
                    <YouTubeVideo key={video.id} video={video.videourl} />
                  </div>
                </VideoWrapper>
              ))}
            </div>
          </section>
        )
      }}
    </Query>
  )
}

export default Videos
