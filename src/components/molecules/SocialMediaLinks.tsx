import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faSoundcloud,
  faSpotify,
  faItunesNote,
  faBandcamp
} from '@fortawesome/free-brands-svg-icons'
import SocialMediaLink from '../atoms/SocialMediaLink'

const SocialIconList = styled.ul`
  padding: 0;
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  li {
    list-style: none;
  }
`

export default () => (
  <SocialIconList>
    <li>
      <SocialMediaLink url='https://www.facebook.com/YesItsAnanias/' linkText='Facebook' icon={<FontAwesomeIcon icon={faFacebook} />} />
    </li>
    <li>
      <SocialMediaLink url='https://www.instagram.com/nstreichenberg/' linkText='Instagram' icon={<FontAwesomeIcon icon={faInstagram} />} />
    </li>
    <li>
      <SocialMediaLink url='https://www.youtube.com/user/YesItsAnanias' linkText='YouTube' icon={<FontAwesomeIcon icon={faYoutube} />} />
    </li>
    <li>
      <SocialMediaLink url='https://soundcloud.com/yes-its-ananias' linkText='Soundcloud' icon={<FontAwesomeIcon icon={faSoundcloud} />} />
    </li>
    <li>
      <SocialMediaLink url='https://open.spotify.com/artist/1OakuD8h6abwYdcEVCs4Hv?si=0f5xRULHSUWn0VygUURzBQ' linkText='Spotify' icon={<FontAwesomeIcon icon={faSpotify} />} />
    </li>
    <li>
      <SocialMediaLink url='https://music.apple.com/ch/artist/yes-its-ananias/557224206' linkText='Apple Music' icon={<FontAwesomeIcon icon={faItunesNote} />} />
    </li>
    <li>
      <SocialMediaLink url='https://yesitsananias.bandcamp.com/releases' linkText='Bandcamp' icon={<FontAwesomeIcon icon={faBandcamp} />} />
    </li>
  </SocialIconList>
)
