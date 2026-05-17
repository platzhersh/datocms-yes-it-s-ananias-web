import React from 'react'
import styled, { css } from 'styled-components'
import { Link, useRoute } from 'wouter'

const NavigationWrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  justify-content: center;
  padding: 20px 0;
  border-top: 4px solid #000;
  border-bottom: 4px solid #000;
  color: #000;
`

const navLinkStyles = css<{ $active?: boolean }>`
  text-decoration: none;
  text-transform: uppercase;
  font-size: 20px;
  margin-left: 10px;
  margin-right: 10px;
  font-weight: bold;
  transition: all 0.3s ease-out;
  text-shadow: 6px 6px ${({ theme }) => theme.colors.grey.regular};

  @media (max-width: 500px) {
    margin: 1em 0;
    flex: 1 1 100%;
  }

  &:hover {
    text-shadow: 1px 1px ${({ theme }) => theme.colors.highlightSecondary};
  }

  ${({ $active }) =>
    $active &&
    css`
      text-shadow: none;
      &:hover {
        text-shadow: none;
      }
    `}
`

const StyledNavLink = styled(Link)<{ $active?: boolean }>`
  ${navLinkStyles}
`

const StyledExternalNavLink = styled.a<{ $active?: boolean }>`
  ${navLinkStyles}
`

type NavItemProps = {
  to: string
  children: React.ReactNode
  onClick?: () => void
}

const NavItem = ({ to, children, onClick }: NavItemProps) => {
  const [active] = useRoute(to)
  return (
    <StyledNavLink to={to} onClick={onClick} $active={!!active}>
      {children}
    </StyledNavLink>
  )
}

type NavigationProps = {
  onNavLinkClick?: () => void
}

export default ({ onNavLinkClick }: NavigationProps) => {
  return (
    <NavigationWrapper>
      <NavItem onClick={onNavLinkClick} to='/'>Home</NavItem>
      <NavItem onClick={onNavLinkClick} to='/about'>About</NavItem>
      <NavItem onClick={onNavLinkClick} to='/shows'>Shows</NavItem>
      <NavItem onClick={onNavLinkClick} to='/releases'>Releases</NavItem>
      <NavItem onClick={onNavLinkClick} to='/discography'>Discography</NavItem>
      <NavItem onClick={onNavLinkClick} to='/videos'>Videos</NavItem>
      <StyledExternalNavLink
        onClick={onNavLinkClick}
        href='https://yesitsananias.bandcamp.com/'
        rel='noopener noreferrer'
        target='_blank'
      >
        Shop
      </StyledExternalNavLink>
    </NavigationWrapper>
  )
}
