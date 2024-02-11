import styled from 'styled-components/macro'

export const ItemContainer = styled.div<{ inverse?: boolean}>`
  border: 3px solid ${({ theme }) => theme.colors.highlightPrimary};
  background: ${({ theme, inverse }) => {
    return inverse ? theme.colors.highlightPrimary : 'none'
  }};
  color: ${({ inverse }) => (inverse ? 'black' : 'inherit')};
  margin-bottom: 20px;
  padding: 20px;
  text-align: center;
  flex: 1 1 auto;
`
