import React from 'react'
import SocialMediaLink from '../atoms/SocialMediaLink'

export default () => (
  <ul className='social-icons'>
    <li>
      <SocialMediaLink url='https://www.facebook.com/YesItsAnanias/' linkText='Facebook' icon={<i className='fab fa-facebook' />} />
    </li>
    <li>
      <SocialMediaLink url='https://www.instagram.com/nstreichenberg/' linkText='Instagram' icon={<i className='fab fa-instagram' />} />
    </li>
    <li>
      <SocialMediaLink url='https://www.youtube.com/user/YesItsAnanias' linkText='YouTube' icon={<i className='fab fa-youtube' />} />
    </li>
    <li>
      <SocialMediaLink url='https://soundcloud.com/yes-its-ananias' linkText='Soundcloud' icon={<i className='fab fa-soundcloud' />} />
    </li>
    <li>
      <SocialMediaLink url='https://open.spotify.com/artist/1OakuD8h6abwYdcEVCs4Hv?si=0f5xRULHSUWn0VygUURzBQ' linkText='Spotify' icon={<i className='fab fa-spotify' />} />
    </li>
    <li>
      <SocialMediaLink url='https://music.apple.com/ch/artist/yes-its-ananias/557224206' linkText='Apple Music' icon={<i className='fab fa-itunes-note' />} />
    </li>
    <li>
      <SocialMediaLink url='https://yesitsananias.bandcamp.com/releases' linkText='Bandcamp' icon={<i className='fab fa-bandcamp' />} />
    </li>
  </ul>)
