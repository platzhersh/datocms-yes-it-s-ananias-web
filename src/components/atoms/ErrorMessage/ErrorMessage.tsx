import React from 'react'
import styled from 'styled-components'
import { ItemContainer } from '../ItemContainer/ItemContainer'

const StyledItemContainer = styled(ItemContainer)`
  border-color: ${({ theme }) => theme.colors.error};
  min-height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.error};
`
const StyledHeader = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headers};
  color: ${({ theme }) => theme.colors.error};
  font-size: 3em;
  margin: 0;
`

type ErrorMessageProps = {
  error?: Error
}

export const ErrorMessage = (props: ErrorMessageProps) => {
  const { error } = props
  const errorMessage = error?.message ?? ''
  console.error(errorMessage)
  const noInternetConnection = errorMessage.includes('NetworkError')
  const authenticationError = errorMessage.includes('401')
  return (
    <StyledItemContainer>
      <div>
        <StyledHeader>OOPS-YIA</StyledHeader>    
        <p>Something went wrong loading this content...</p>
        {authenticationError && (
          <p>Could not authenticate with the server.</p>
        )}
        {noInternetConnection && (
          <p>Check your internet connection and try to reload.</p>
        )}
        {!noInternetConnection && <p>Please try to reload.</p>}
      </div>
    </StyledItemContainer>
  )
}
