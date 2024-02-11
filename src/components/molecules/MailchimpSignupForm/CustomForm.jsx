import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ActionButton } from '../../atoms/ActionButton/ActionButton'

const StyledInput = styled.input`
  display: block;
  flex: 1 1 300px;
  max-width: 400px;
  border-radius: 0.2rem;
  padding: 0.5em 0.75em;
  font-size: 100%;
  border: 1px solid rgba(0, 0, 0, 0.25);
  color: #4d4d4d;
  margin: 0.5em 0 !important;
  box-sizing: border-box;

  &:focus {
    border-color: rgba(0, 0, 0, 0.25);
  }
`
const StyledActionButton = styled(ActionButton)`
  flex: 0 0 auto;
  margin: 0.5em 0 0.5em 1em;
`

const StyledForm = styled.form``

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-items: center;
  justify-content: center;
  align-items: center;
  align-content: center;
`

export const CustomForm = ({ status, message, onValidated }) => {
  const [email, setEmail] = useState('')

  const onEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    email && email.indexOf('@') > -1 && onValidated({ EMAIL: email })
  }

  useEffect(() => {
    if (status === 'success') clearFields()
  }, [status])

  const clearFields = () => {
    setEmail('')
  }

  return (
    <StyledForm onSubmit={(event) => handleSubmit(event)}>
      <div>
        {status === 'sending' && <div>Sending...</div>}
        {status === 'error' && (
          <div dangerouslySetInnerHTML={{ __html: message }} />
        )}
        {status === 'success' && (
          <div dangerouslySetInnerHTML={{ __html: message }} />
        )}
      </div>

      <FormRow>
        <StyledInput
          label="Email"
          onChange={onEmailChange}
          type="email"
          value={email}
          placeholder="your@email.com"
          isRequired
        />
        <StyledActionButton
          type="submit"
          formValues={[email]}
          text="Subscribe"
        />
      </FormRow>
    </StyledForm>
  )
}
