import React from 'react'
import styled from 'styled-components'
import { ItemContainer } from '../atoms/ItemContainer/ItemContainer'
import { MailchimpSignupForm } from './MailchimpSignupForm/MailchimpSignupForm'

const StyledFooter = styled.footer`
  margin-top: 2em;
  padding: 2em 0;
`

export default () => (
  <StyledFooter className='Footer-footer'>
    <h1>Newsletter</h1>
    <ItemContainer>
      <MailchimpSignupForm />
    </ItemContainer>

    <div>© YesItsAnanias.com, {new Date().getFullYear()}</div>
  </StyledFooter>
)
