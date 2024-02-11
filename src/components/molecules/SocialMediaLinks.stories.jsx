import React from 'react'
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import SocialMediaLinks from './SocialMediaLinks'

export default {
  component: SocialMediaLinks,
  title: 'molecules/SocialMediaLinks'
}

const Template = args => <SocialMediaLinks {...args} />

export const Default = Template.bind({})
Default.args = {

}
