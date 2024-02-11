import React from 'react'
import { Link as NavLink } from 'wouter'
import styled from 'styled-components'

const ResponsiveNavLink = styled(NavLink)`
   @media (max-width: 400px) {
    margin: 0;
    flex: 1 1 auto;
  }
`

export default props => {
  const { to, external, text, exact, className, activeClassName } = props

  if (external) {
    return <a href={to} rel='noopener noreferrer' target='_blank' className={className}>{text}</a>
  } else {
    return (
      <ResponsiveNavLink to={to} className={className} activeClassName={activeClassName}>
        {text}
      </ResponsiveNavLink>
    )
  }
}
