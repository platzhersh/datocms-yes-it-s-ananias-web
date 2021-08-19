import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'


const ResponsiveNavLink = styled(NavLink)`
   @media (max-width: 400px) {
    margin: 0;
    flex: 1 1 auto;
  }
`;

export default props => {
  const { to, external, text, exact, className, activeClassName } = props;

console.log(props);

  if (external) {
      console.log('external')
    return <a href={to} rel='noopener noreferrer' target='_blank' className={className}>{text}</a>
  } else {
   return <ResponsiveNavLink exact={exact} to={to} className={className} activeClassName={activeClassName}>
    {text}
  </ResponsiveNavLink>
  }
}
