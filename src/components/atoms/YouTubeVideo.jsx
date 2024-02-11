import React from 'react'
import styled from 'styled-components'

const StyledIframe = styled.iframe`
    /* width: 100%; */
    overflow: hidden;
    background: transparent;
    border: none;
    height: 300px;
    width: 600px;
    max-width: 100%;
`;
const getEmbedUrl = (video) => {
  return `https://www.youtube.com/embed/${video.providerUid}`
}

export default props => {
  const {video} = props;

  const youTubeEmbedUrl = getEmbedUrl(video);

  return <StyledIframe width="560"
    // height={video.height}
    // width={video.width}
    loading='lazy'
    src={youTubeEmbedUrl}
    title={video.title}
    sandbox='allow-same-origin allow-scripts'
    frameBorder="0"
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen />
}