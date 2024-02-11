import React from 'react'
import { Theme } from '../../organisms/Theme'
import { ErrorMessage } from './ErrorMessage'

export default {
  component: ErrorMessage,
  title: 'atoms/ErrorMessage'
}

const Template = (args) => (
  <Theme>
    <ErrorMessage {...args} />
  </Theme>
)

export const Default = Template.bind({})
Default.args = {
  errorMessage: ''
}
