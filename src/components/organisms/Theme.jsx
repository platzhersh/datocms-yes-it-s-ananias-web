import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../styles/theme'

export const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)
