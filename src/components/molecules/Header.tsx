import React from 'react'
import { Link as NavLink } from 'wouter'
import styled from 'styled-components'
import { MobileMenuButton } from '../organisms/mobile-menu/MobileMenuButton'
import Navigation from '../organisms/Navigation'
import Contact from './Contact'
import SocialMediaLinks from './SocialMediaLinks'

const StyledHeader = styled.header`
  text-align: center;
  margin-bottom: 10px;
`

const StyledHeading1 = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headers};
  font-weight: normal;
  font-size: 56px;
  margin-bottom: 0;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.highlightPrimary};

  &:hover {
    text-shadow: 6px 6px ${({ theme }) => theme.colors.grey.regular};
    transition: all 0.3s ease-out;
  }
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
    <StyledNavLink to='/'>
      <StyledHeading1>Yes it's Ananias</StyledHeading1>
    </StyledNavLink>

    <h2>Contemporary Psycho-Automatic Piano</h2>

    <SocialMediaLinks />

    <Contact />
    <NavigationWrapper>
      <Navigation />
    </NavigationWrapper>
  </StyledHeader>
)
