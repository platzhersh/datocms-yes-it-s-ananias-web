import React from 'react'
import styled from 'styled-components/macro'

const StyledButton = styled.button`
  width: auto;
  border-radius: 500px;
  display: inline-block;
  margin: auto;
  padding: 1em 2em;
  background: green;
  border: none;
  color: white;
  font-size: 1.2em;
`

export default (props) => {
  const { text } = props
  return <StyledButton>{text}</StyledButton>
}
