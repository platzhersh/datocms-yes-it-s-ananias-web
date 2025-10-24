import React from 'react'
import SocialMediaLink from '../atoms/SocialMediaLink'
import { Icon } from '../atoms/Icon'
import styled from 'styled-components'

const StyledSocialContainer = styled.ul`
// @media (max-width: 400px) {
//     padding-left: 0;
//     padding-right: 0;
//     display: flex;
//     justify-content: space-between;
//     flex-wrap: wrap;
//   }
`;
const ResponsiveSocialMediaLinkWrapper = styled.li`
// @media (max-width: 400px) {
//     flex: 1 0 50%;
//   }
`;

export default () => (
  <StyledSocialContainer className='social-icons'>
    <ResponsiveSocialMediaLinkWrapper>
      <SocialMediaLink url='https://www.facebook.com/YesItsAnanias/' linkText='Facebook' icon={<Icon name='facebook' size={20} />} />
    </ResponsiveSocialMediaLinkWrapper>
    <ResponsiveSocialMediaLinkWrapper>
      <SocialMediaLink url='https://www.instagram.com/nstreichenberg/' linkText='Instagram' icon={<Icon name='instagram' size={20} />} />
    </ResponsiveSocialMediaLinkWrapper>
    <ResponsiveSocialMediaLinkWrapper>
      <SocialMediaLink url='https://www.youtube.com/user/YesItsAnanias' linkText='YouTube' icon={<Icon name='youtube' size={20} />} />
    </ResponsiveSocialMediaLinkWrapper>
    <ResponsiveSocialMediaLinkWrapper>
      <SocialMediaLink url='https://soundcloud.com/yes-its-ananias' linkText='Soundcloud' icon={<Icon name='soundcloud' size={20} />} />
    </ResponsiveSocialMediaLinkWrapper>
    <ResponsiveSocialMediaLinkWrapper>
      <SocialMediaLink url='https://open.spotify.com/artist/1OakuD8h6abwYdcEVCs4Hv?si=0f5xRULHSUWn0VygUURzBQ' linkText='Spotify' icon={<Icon name='spotify' size={20} />} />
    </ResponsiveSocialMediaLinkWrapper>
    <ResponsiveSocialMediaLinkWrapper>
      <SocialMediaLink url='https://music.apple.com/ch/artist/yes-its-ananias/557224206' linkText='Apple Music' icon={<Icon name='apple-music' size={20} />} />
    </ResponsiveSocialMediaLinkWrapper>
    <ResponsiveSocialMediaLinkWrapper>
      <SocialMediaLink url='https://yesitsananias.bandcamp.com/releases' linkText='Bandcamp' icon={<Icon name='bandcamp' size={20} />} />
    </ResponsiveSocialMediaLinkWrapper>
  </StyledSocialContainer>)
