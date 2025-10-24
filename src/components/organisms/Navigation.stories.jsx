import React from 'react';
import { Switch } from "wouter";
import '../../styles/index.scss';
import Navigation from './Navigation';

export default {
  component: Navigation,
  title: 'organisms/Navigation',
};

const Template = args => <Router><Navigation {...args} /></Router>;

export const Default = Template.bind({});
Default.args = {
  
};
