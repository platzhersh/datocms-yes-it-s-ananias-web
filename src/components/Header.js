import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'
import Contact from './molecules/Contact'

const StyledHeader = styled.h1`
  font-family: 'Nineteen Ten Vienna', sans-serif;
  margin-bottom: 0;
`

const StyledNavLink = styled(NavLink)`
  margin: 0;
`;

export default () => (
  <header className='Header-header'>
    <StyledNavLink
        exact
        to='/'
      >
        <StyledHeader className='Header-h1'>Yes it's Ananias</StyledHeader>
      </StyledNavLink>
    
    <h2 className='Header-h2'>Contemporary Psycho-Automatic Piano</h2>

    <Contact />

    <nav className='Header-nav'>
      <NavLink
        exact
        to='/'
        className='Header-navLink'
        activeClassName='Header-isActive'
      >
        Home
      </NavLink>
      <NavLink
        to='/about'
        className='Header-navLink'
        activeClassName='Header-isActive'
      >
        About
      </NavLink>
      <NavLink
        to='/releases'
        className='Header-navLink'
        activeClassName='Header-isActive'
      >
        Releases
      </NavLink>
    </nav>
  </header>
)
