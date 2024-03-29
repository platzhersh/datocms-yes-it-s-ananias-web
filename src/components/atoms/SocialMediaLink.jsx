import React from "react";
import styled from "styled-components";

const SocialMediaLinkA = styled.a``;

const SocialMediaLinkIcon = styled.span``;

const SocialMediaLinkText = styled.span`
  @media (max-width: 500px) {
    display: none;
  }
`;

export default (props) => {
  const { url, linkText, icon } = props;
  return (
    <SocialMediaLinkA href={url} rel="noopener noreferrer" target="_blank" title={linkText}>
      <SocialMediaLinkIcon>{icon}</SocialMediaLinkIcon>{" "}
      <SocialMediaLinkText>{linkText}</SocialMediaLinkText>
    </SocialMediaLinkA>
  );
};
