import React from 'react'
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import { Theme } from '../organisms/Theme'
import Footer from './Footer'

export default {
  component: Footer,
  title: 'molecules/Footer'
}

const Template = (args) => (
  <Theme>
    <Footer {...args} />
  </Theme>
)

export const Default = Template.bind({})
Default.args = {}
