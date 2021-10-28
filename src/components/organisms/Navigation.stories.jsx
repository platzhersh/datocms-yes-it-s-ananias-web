import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import '../../styles/fonts.scss';
import '../../styles/index.scss';
import '../../styles/old-style.scss';
import Navigation from './Navigation';

export default {
  component: Navigation,
  title: 'organisms/Navigation',
};

const Template = args => <Router><Navigation {...args} /></Router>;

export const Default = Template.bind({});
Default.args = {
  
};
