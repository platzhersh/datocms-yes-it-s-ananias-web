import React from 'react'
import { ItemContainer } from '../../atoms/ItemContainer/ItemContainer'
import YouTubeVideo from '../../atoms/YouTubeVideo'

export const VideoCard = ({ video }) => {
  return (
    <ItemContainer>
      <h2>{video.title}</h2>
      <div>
        <YouTubeVideo video={video.videourl} />
      </div>
    </ItemContainer>
  )
}
