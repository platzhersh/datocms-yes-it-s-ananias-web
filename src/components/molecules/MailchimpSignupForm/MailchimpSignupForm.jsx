import React from 'react'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import { CustomForm } from './CustomForm'

export const MailchimpSignupForm = (props) => {
  const urlBase = import.meta.env.VITE_APP_MAILCHIMP_URL
  const mailchimp_u = import.meta.env.VITE_APP_MAILCHIMP_U
  const mailchimp_id = import.meta.env.VITE_APP_MAILCHIMP_ID

  if (!urlBase || !mailchimp_u || !mailchimp_id) {
    return <>Mailchimp Settings missing or wrongly setup.</>
  }
  const postUrl = `${urlBase}/subscribe/post?u=${mailchimp_u}&id=${mailchimp_id}`

  return (
    <>
      <MailchimpSubscribe
        url={postUrl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => {
              return subscribe(formData)
            }}
          />
        )}
      />
    </>
  )
}
