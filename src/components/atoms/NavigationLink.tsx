import React from "react";
import { Link as NavLink } from "wouter";
import styled from "styled-components";

const ResponsiveNavLink = styled<any>(NavLink)`
  @media (max-width: 500px) {
    margin: 1em 0;
    flex: 1 1 100%;
  }
`;

const ResponsiveA = styled.a`
@media (max-width: 500px) {
  margin: 1em 0;
  flex: 1 1 100%;
}
`

type NavigationLinkProps = {
  to: string;
  external: boolean;
  text: string;
  className: string;
  activeClassName: string;
  onClick?: () => void;
};

export const NavigationLink = (props: NavigationLinkProps) => {
  const { to, external, text, className, activeClassName } = props;

  if (external) {
    return (
      <ResponsiveA
        href={to}
        rel="noopener noreferrer"
        target="_blank"
        className={className}
      >
        {text}
      </ResponsiveA>
    );
  } else {
    return (
      <ResponsiveNavLink
        to={to}
        className={className}
        activeClassName={activeClassName}
        onClick={props.onClick}
      >
        {text}
      </ResponsiveNavLink>
    );
  }
};

export default NavigationLink;
