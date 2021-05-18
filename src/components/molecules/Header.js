import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'
import Contact from './Contact'
import SocialMediaLinks from './SocialMediaLinks'

const StyledHeader = styled.h1`
  font-family: 'Nineteen Ten Vienna', sans-serif;
  margin-bottom: 0;
`

const StyledNavLink = styled(NavLink)`
  margin: 0;
`;

const ResponsiveNavigation = styled.nav`
@media (max-width: 400px) {
    padding-left: 0;
    padding-right: 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

const ResponsiveNavLink = styled(NavLink)`
   @media (max-width: 400px) {
    margin: 0;
    flex: 1 1 auto;
  }
`;

export default () => (
  <header className='Header-header'>
    <StyledNavLink exact to='/'>
        <StyledHeader className='Header-h1'>Yes it's Ananias</StyledHeader>
      </StyledNavLink>
    
    <h2 className='Header-h2'>Contemporary Psycho-Automatic Piano</h2>

    <SocialMediaLinks />


    <Contact />

    <ResponsiveNavigation className='Header-nav'>
      <ResponsiveNavLink exact to='/' className='Header-navLink' activeClassName='Header-isActive'>
        Home
      </ResponsiveNavLink>
      <ResponsiveNavLink  to='/about'  className='Header-navLink'  activeClassName='Header-isActive'>
        About
      </ResponsiveNavLink>
      <ResponsiveNavLink  to='/releases'  className='Header-navLink'  activeClassName='Header-isActive'>
        Releases
      </ResponsiveNavLink>
      <ResponsiveNavLink  to='/videos'  className='Header-navLink'  activeClassName='Header-isActive'>
       Videos
      </ResponsiveNavLink>
    </ResponsiveNavigation>
  </header>
)
