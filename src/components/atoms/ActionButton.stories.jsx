import React from 'react';

import ActionButton from './ActionButton';

export default {
  component: ActionButton,
  title: 'atoms/ActionButton',
};

const Template = args => <ActionButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: 'Button Text'
};
