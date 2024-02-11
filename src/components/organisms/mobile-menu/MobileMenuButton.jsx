import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import MobileMenu from './MobileMenu'

const BurgerButton = styled.div`
  display: none;

  @media (max-width: 500px) {
    z-index: 1000;
    top: 16px;
    right: 16px;
    display: block;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #de6d2c;

    font-size: 24px;
    line-height: 42px;
    color: black;
  }
`

const MobileMenuButton = (props) => {
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setShowMenu(false)
  }, [props.location])

  return (
    <>
      <BurgerButton onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? '╳' : '☰'}
      </BurgerButton>
      <MobileMenu visible={showMenu} />
    </>
  )
}

export default MobileMenuButton
