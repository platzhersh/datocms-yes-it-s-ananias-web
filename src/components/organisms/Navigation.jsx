import React from 'react'
import styled from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import NavigationLink from '../atoms/NavigationLink'

// TODO: migrate ResponsiveNavLink to NavigationLink
// TODO: trigger closing of modal

const NavigationWrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  justify-content: center;
`

const ResponsiveNavLink = styled(NavLink)`
  @media (max-width: 500px) {
    margin: 1em 0;
    flex: 1 1 100%;
  }
`

export default (_props) => {
  return (
    <NavigationWrapper className="Header-nav">
      <ResponsiveNavLink
        exact
        to="/"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Home
      </ResponsiveNavLink>
      <ResponsiveNavLink
        to="/about"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        About
      </ResponsiveNavLink>
      <ResponsiveNavLink
        to="/releases"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Releases
      </ResponsiveNavLink>
      <ResponsiveNavLink
        to="/discography"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Discography
      </ResponsiveNavLink>
      <ResponsiveNavLink
        to="/videos"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Videos
      </ResponsiveNavLink>

      <NavigationLink
        external={true}
        to="https://yesitsananias.bandcamp.com/"
        className="Header-navLink"
        activeClassName="Header-isActive"
        text="Shop"
      />
    </NavigationWrapper>
  )
}
