import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import TagManager from 'react-gtm-module'
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import client from './client'
import App from './components/App'
import './styles/fonts.scss'
import './styles/index.scss'
import './styles/old-style.scss'

const tagManagerArgs = {
  gtmId: process.env.GTM_ID ?? undefined,
}

if (tagManagerArgs.gtmId) {
  TagManager.initialize(tagManagerArgs)
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
)
