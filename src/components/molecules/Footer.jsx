import React from 'react'
import styled from 'styled-components'
import { ItemContainer } from '../atoms/ItemContainer/ItemContainer'
import { MailchimpSignupForm } from './MailchimpSignupForm/MailchimpSignupForm'

const StyledFooter = styled.footer`
  margin-top: 2em;
  padding: 20px 0;
  border-top: 4px solid #000;
  border-bottom: 4px solid #000;
`

export default () => (
  <StyledFooter>
    <h1>Newsletter</h1>
    <ItemContainer>
      <MailchimpSignupForm />
    </ItemContainer>

    <div>© YesItsAnanias.com, {new Date().getFullYear()}</div>
  </StyledFooter>
)
