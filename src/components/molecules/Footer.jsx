import React from 'react'
import styled from 'styled-components'
import { ItemContainer } from '../atoms/ItemContainer/ItemContainer'
import { MailchimpSignupForm } from './MailchimpSignupForm/MailchimpSignupForm'

const dateToday = new Date()

const StyledFooter = styled.footer`
  margin-top: 2em;
  padding: 2em 0;
`

const CopyRight = styled.div``

export default () => (
  <StyledFooter className='Footer-footer'>
    <h1>Newsletter</h1>
    <ItemContainer>
      <MailchimpSignupForm />
    </ItemContainer>

    <CopyRight>© YesItsAnanias.com, {dateToday.getFullYear()}</CopyRight>
  </StyledFooter>
)
