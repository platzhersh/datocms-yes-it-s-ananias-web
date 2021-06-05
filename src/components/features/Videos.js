import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import YouTubeVideo from '../atoms/YouTubeVideo'
import styled from 'styled-components/macro'
import ItemContainer from '../atoms/ItemContainer'

const videosQuery = gql `

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
}`

const VideoWrapper = styled(ItemContainer)`

`;

const Videos = props => {
  return ( <Query query={videosQuery}>
    {({data, loading, error}) => {
      if (loading) return 'Loading...'
      if (error) return `ERROR: ${error}`

      return (
        <section>
                <div>
                    {data.allVideos.map(video => (
          <VideoWrapper>
              <h3>{video.title}</h3>
          <div><YouTubeVideo key={video.id} video={video.videourl} /></div>
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