import React from 'react'
import styled from 'styled-components/macro'
import { ItemContainer } from '../ItemContainer/ItemContainer'

const StyledItemContainer = styled(ItemContainer)`
  border-color: ${({ theme }) => theme.colors.error};
  min-height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledHeader = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headers};
  color: ${({ theme }) => theme.colors.error};
  font-size: 3em;
  margin: 0;
`

export const ErrorMessage = (props) => {
  const { error } = props
  const errorMessage = error.message
  console.error(errorMessage)
  const noInternetConnection = errorMessage.includes('Network error')
  return (
    <StyledItemContainer>
      <div>
        <StyledHeader>OOPS-YIA</StyledHeader>
        {!noInternetConnection && (
          <p>Something went wrong loading this part of the website...</p>
        )}
        {noInternetConnection && (
          <p>Looks like you are not connected to the internet...</p>
        )}
        {noInternetConnection && (
          <p>Check your internet connection and try to reload.</p>
        )}
        {!noInternetConnection && <p>Please try to reload.</p>}
      </div>
    </StyledItemContainer>
  )
}
