import React from 'react'

import ActionButton from './ActionButton'
import { Theme } from '../organisms/Theme'

export default {
  component: ActionButton,
  title: 'atoms/ActionButton',
}

const Template = (args) => (
  <Theme>
    <ActionButton {...args} />
  </Theme>
)

export const Default = Template.bind({})
Default.args = {
  text: 'Button Text',
}

export const Spotify = Template.bind({})
Spotify.args = {
  variant: 'spotify',
  text: 'Button Text',
}

export const Bandcamp = Template.bind({})
Bandcamp.args = {
  variant: 'bandcamp',
  text: 'Button Text',
}
