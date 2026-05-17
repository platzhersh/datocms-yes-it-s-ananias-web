import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { createRoot } from 'react-dom/client'
import client from './client'
import App from './components/App'
import './styles/fonts.scss'
import './styles/index.scss'
import initGtm from './gtm'

const container = document.getElementById('root')
if (!container) throw new Error('No root element found')
const root = createRoot(container)
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

const scheduleGtm =
  typeof window.requestIdleCallback === 'function'
    ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 4000 })
    : (cb: () => void) => window.setTimeout(cb, 2000)
scheduleGtm(initGtm)
