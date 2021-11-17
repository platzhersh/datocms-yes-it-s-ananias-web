import styled from 'styled-components/macro'

export const ItemContainer = styled.div`
  border: 3px solid ${({ theme }) => theme.colors.highlightPrimary};
  margin-bottom: 20px;
  padding: 20px;
  text-align: center;
`

export default ItemContainer
