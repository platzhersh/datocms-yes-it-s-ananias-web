import React from 'react'
import styled from 'styled-components/macro'
import { ItemContainer } from '../ItemContainer/ItemContainer'

const StyledItemContainer = styled(ItemContainer)`
  border: none;
  height: 250px;
`
const StyledHeader = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headers};
  color: ${({ theme }) => theme.colors.highlightPrimary};
  font-size: 3em;
  margin-bottom: 0;
`

export const LoadingPlaceholder = (props) => {
  return (
    <StyledItemContainer>
      <div>
        <StyledHeader>YIA</StyledHeader>
        <span>Loading...</span>
      </div>
    </StyledItemContainer>
  )
}
