import React from 'react'
import { gql } from '@apollo/client'
import { VideoFragment } from '../../queries/fragments/VideoFragment'
import { QueryLoader } from '../organisms/QueryLoader/QueryLoader'
import { VideoCard } from '../molecules/VideoCard/VideoCard'

const videosQuery = gql`
  query VideosQuery {
    allVideos(orderBy: listposition_ASC) {
     ${VideoFragment}
    }
  }
`

const Videos = () => (
  <QueryLoader
    query={videosQuery}
    successCallback={(data) => (
      <section>
        <div>
          {data.allVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    )}
  />
)

export default Videos
