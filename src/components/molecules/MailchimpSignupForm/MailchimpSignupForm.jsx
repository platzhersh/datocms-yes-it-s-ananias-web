import React from 'react'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import { CustomForm } from './CustomForm'

export const MailchimpSignupForm = () => {
  const urlBase = import.meta.env.VITE_APP_MAILCHIMP_URL
  const mailchimpU = import.meta.env.VITE_APP_MAILCHIMP_U
  const mailchimpId = import.meta.env.VITE_APP_MAILCHIMP_ID

  if (!urlBase || !mailchimpU || !mailchimpId) {
    if (import.meta.env.DEV) {
      console.warn('Mailchimp env vars missing — signup form hidden')
    }
    return null
  }
  const postUrl = `${urlBase}/subscribe/post?u=${mailchimpU}&id=${mailchimpId}`

  return (
    <>
      <MailchimpSubscribe
        url={postUrl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            mailchimpUrl={postUrl}
            onValidated={(formData) => {
              return subscribe(formData)
            }}
          />
        )}
      />
    </>
  )
}
