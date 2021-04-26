import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'

const StyledHeader = styled.h1`
  font-family: 'Nineteen Ten Vienna', sans-serif
`

export default () => (
  <header className='Header-header'>
    <StyledHeader className='Header-h1'>Yes it's Ananias</StyledHeader>
    <h2 className='Header-h2'>Contemporary Psycho-Automatic Piano</h2>

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
    </nav>
  </header>
)
