import React, { useState, useEffect, useRef } from 'react'
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

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin: 0.5em 0;
`

const FallbackLink = styled.a`
  color: ${props => props.theme.colors.highlightPrimary};
  text-decoration: underline;

  &:hover {
    color: ${props => props.theme.colors.highlightSecondary};
  }
`

export const CustomForm = ({ status, message, onValidated, mailchimpUrl }) => {
  const [email, setEmail] = useState('')
  const [isTimeout, setIsTimeout] = useState(false)
  const timeoutRef = useRef(null)

  const onEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsTimeout(false)

    if (email && email.indexOf('@') > -1) {
      // Set a timeout to detect if Mailchimp is blocked
      timeoutRef.current = setTimeout(() => {
        setIsTimeout(true)
      }, 6000) // 6 second timeout

      onValidated({ EMAIL: email })
    }
  }

  useEffect(() => {
    if (status === 'success') {
      clearFields()
      clearTimeout(timeoutRef.current)
    }
    if (status === 'error') {
      clearTimeout(timeoutRef.current)
    }
  }, [status])

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const clearFields = () => {
    setEmail('')
  }

  const getDirectSignupUrl = () => {
    if (!mailchimpUrl) return '#'
    // Convert POST URL to direct signup form URL (keep query params)
    // Example: .../subscribe/post?u=xxx&id=yyy -> .../subscribe?u=xxx&id=yyy
    return mailchimpUrl.replace('/subscribe/post?', '/subscribe?')
  }

  return (
    <StyledForm onSubmit={(event) => handleSubmit(event)}>
      <div>
        {status === 'sending' && !isTimeout && <div>Sending...</div>}
        {status === 'sending' && isTimeout && (
          <ErrorMessage>
            Error: Timeout - Your browser might be blocking Mailchimp.{' '}
            <FallbackLink href={getDirectSignupUrl()} target="_blank" rel="noopener noreferrer">
              Click here to subscribe directly
            </FallbackLink>
          </ErrorMessage>
        )}
        {status === 'error' && (
          <ErrorMessage>
            <div dangerouslySetInnerHTML={{ __html: message }} />
            {mailchimpUrl && (
              <div style={{ marginTop: '0.5em' }}>
                Or{' '}
                <FallbackLink href={getDirectSignupUrl()} target="_blank" rel="noopener noreferrer">
                  subscribe directly on Mailchimp
                </FallbackLink>
              </div>
            )}
          </ErrorMessage>
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
