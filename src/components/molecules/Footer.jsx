import React from 'react'
import styled from 'styled-components/macro'

const dateToday = new Date()

const StyledFooter = styled.footer`
  margin-top: 2em;
  padding: 2em;
`

const CopyRight = styled.div``

export default () => (
  <StyledFooter className="Footer-footer">
    <CopyRight>© YesItsAnanias.com, {dateToday.getFullYear()}</CopyRight>
  </StyledFooter>
)
