import React from 'react'
import styled from 'styled-components'

import { ItemContainer } from './ItemContainer'
import { Theme } from '../../organisms/Theme'

export default {
  component: ItemContainer,
  title: 'atoms/ItemContainer',
}

const Background = styled.div`
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
      <ItemContainer {...args}>Just some content </ItemContainer>
    </Background>
  </Theme>
)

export const Default = Template.bind({})
Default.args = {
  inverse: false,
}
