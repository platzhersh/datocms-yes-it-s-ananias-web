import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import client from './client'
import App from './components/App'
import './styles/fonts.scss'
import './styles/index.scss'
import './styles/old-style.scss'
import initGtm from './gtm'

initGtm()

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
)
