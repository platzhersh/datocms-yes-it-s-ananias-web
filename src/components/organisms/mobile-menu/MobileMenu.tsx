import React from 'react';
import styled from 'styled-components'
import Navigation from '../Navigation'

// TODO: transition
// navigation style

const MenuOverlay = styled.div`
  display: none;
  

  @media (max-width: 500px) {
    position: fixed;
    z-index: 900;
    top: 0;
    left: 0;
    display: block;
    box-sizing: border-box;
    max-width: 100vw;
    width: 100%;
    height: 100%;
    padding: 32px;
    overflow-x: hidden;
    background: black;
  }
`

const MobileNavigation = styled(Navigation)`
  position: absolute;
  top: 0px;
  left: 0px;
  box-sizing: border-box;

`;

type MobileMenuProps = {
  visible: boolean,
  onNavLinkClick?: () => void
}

export const MobileMenu = ({visible, onNavLinkClick}: MobileMenuProps) => {
      
      return <>{visible && <MenuOverlay><MobileNavigation onNavLinkClick={onNavLinkClick}/></MenuOverlay>}</>;
}
