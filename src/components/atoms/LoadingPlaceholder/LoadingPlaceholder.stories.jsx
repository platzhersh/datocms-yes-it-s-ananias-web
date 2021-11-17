import React from 'react'
import { Theme } from '../../organisms/Theme'
import { LoadingPlaceholder } from './LoadingPlaceholder'

export default {
  component: LoadingPlaceholder,
  title: 'atoms/LoadingPlaceholder',
}

const Template = (args) => (
  <Theme>
    <LoadingPlaceholder {...args} />
  </Theme>
)

export const Default = Template.bind({})
Default.args = {}
