import React from 'react'
import styled from 'styled-components/macro'

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
    src={youTubeEmbedUrl}
    title={video.title}
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen />
}