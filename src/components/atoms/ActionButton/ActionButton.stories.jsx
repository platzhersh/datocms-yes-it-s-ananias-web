import React from 'react'
import styled from 'styled-components'

import { ActionButton } from './ActionButton'
import { Theme } from '../../organisms/Theme'

export default {
  component: ActionButton,
  title: 'atoms/ActionButton',
}

const Background = styled.div`
  background: ${({ inverse }) => (inverse ? 'antiquewhite' : 'black')};
  height: 100%;
  min-height: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
`

const Template = (args) => (
  <Theme>
    <Background {...args}>
      <ActionButton {...args} />
    </Background>
  </Theme>
)

export const Default = Template.bind({})
Default.args = {
  text: 'Button Text',
  inverse: false,
}

export const Spotify = Template.bind({})
Spotify.args = {
  variant: 'spotify',
  text: 'Button Text',
  inverse: false,
}

export const Bandcamp = Template.bind({})
Bandcamp.args = {
  variant: 'bandcamp',
  text: 'Button Text',
  inverse: false,
}

export const Youtube = Template.bind({})
Youtube.args = {
  variant: 'youtube',
  text: 'Button Text',
  inverse: false,
}
