import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import client from './client'
import App from './components/App'
import './styles/index.scss'
import initGtm from './gtm'

initGtm()

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
if (!container) throw new Error('No root element found');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<ApolloProvider client={client}>
  <App />
</ApolloProvider>,);

