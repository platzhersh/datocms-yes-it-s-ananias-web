import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'
import MobileMenuButton from '../organisms/mobile-menu/MobileMenuButton'
import Navigation from '../organisms/Navigation'
import Contact from './Contact'
import SocialMediaLinks from './SocialMediaLinks'

const StyledHeader = styled.header`
  text-align: center;
  margin-bottom: 10px;
`

const StyledHeading1 = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headers};
  margin-bottom: 0;
`

const StyledNavLink = styled(NavLink)`
  margin: 0;
`

const NavigationWrapper = styled.div`
  @media (max-width: 500px) {
    &,
    * {
      display: none;
    }
  }
`

export default () => (
  <StyledHeader>
    <MobileMenuButton />
    <StyledNavLink exact to="/">
      <StyledHeading1 className="Header-h1">Yes it's Ananias</StyledHeading1>
    </StyledNavLink>

    <h2 className="Header-h2">Contemporary Psycho-Automatic Piano</h2>

    <SocialMediaLinks />

    <Contact />
    <NavigationWrapper>
      <Navigation className="Header-nav" />
    </NavigationWrapper>
  </StyledHeader>
)
