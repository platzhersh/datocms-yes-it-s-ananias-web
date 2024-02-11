import React from "react";
import styled from "styled-components";
import { Link as NavLink } from "wouter";
import NavigationLink from "../atoms/NavigationLink";

// TODO: migrate ResponsiveNavLink to NavigationLink
// TODO: trigger closing of modal

const NavigationWrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  justify-content: center;
`;

const ResponsiveNavLink = styled<any>(NavLink)`
  @media (max-width: 500px) {
    margin: 1em 0;
    flex: 1 1 100%;
  }
`;
type NavigationProps = {
  onNavLinkClick?: () => void;
};

export default ({ onNavLinkClick }: NavigationProps) => {
  return (
    <NavigationWrapper className="Header-nav">
      <ResponsiveNavLink
        onClick={onNavLinkClick}
        to="/"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Home
      </ResponsiveNavLink>
      <ResponsiveNavLink
        onClick={onNavLinkClick}
        to="/about"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        About
      </ResponsiveNavLink>
      <ResponsiveNavLink
        onClick={onNavLinkClick}
        to="/shows"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Shows
      </ResponsiveNavLink>
      <ResponsiveNavLink
        onClick={onNavLinkClick}
        to="/releases"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Releases
      </ResponsiveNavLink>
      <ResponsiveNavLink
        onClick={onNavLinkClick}
        to="/discography"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Discography
      </ResponsiveNavLink>
      <ResponsiveNavLink
        onClick={onNavLinkClick}
        to="/videos"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Videos
      </ResponsiveNavLink>

      <NavigationLink
        onClick={onNavLinkClick}
        external={true}
        to="https://yesitsananias.bandcamp.com/"
        className="Header-navLink"
        activeClassName="Header-isActive"
        text="Shop"
      />
    </NavigationWrapper>
  );
};
