import React from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

type YouTubeVideoProps = {
  video: {
    title: string,
    providerUid: string,
  }
}

export const YouTubeVideo = ({video}: YouTubeVideoProps) => {
  return <LiteYouTubeEmbed id={video.providerUid} title={video.title} />;
};

export default YouTubeVideo;
