import React from 'react'
import '../../styles/fonts.scss'
import '../../styles/index.scss'
import Navigation from './Navigation'

export default {
  component: Navigation,
  title: 'organisms/Navigation'
}

const Template = args => <Navigation {...args} />

export const Default = Template.bind({})
Default.args = {}
