import React from 'react'

import { MailchimpSignupForm } from './MailchimpSignupForm'
import { Theme } from '../../organisms/Theme'

export default {
  component: MailchimpSignupForm,
  title: 'molecules/MailchimpSignupForm'
}

const Template = (args) => (
  <Theme>
    <MailchimpSignupForm {...args} />
  </Theme>
)

export const Default = Template.bind({})
Default.args = {
  text: 'Button Text'
}
