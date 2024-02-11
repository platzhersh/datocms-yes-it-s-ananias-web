import React from 'react'
import styled from 'styled-components'
import { ItemContainer } from '../../atoms/ItemContainer/ItemContainer'
import YouTubeVideo from '../../atoms/YouTubeVideo'

const VideoWrapper = styled(ItemContainer)``

export const VideoCard = ({ video }) => {
  return (
    <VideoWrapper key={video.id}>
      <h3>{video.title}</h3>
      <div>
        <YouTubeVideo key={video.id} video={video.videourl} />
      </div>
    </VideoWrapper>
  )
}
