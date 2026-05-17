import { colorPalette } from './colorPalette'
import { fonts } from './fonts'

export const theme = {
  colors: {
    ...colorPalette,
    highlightPrimary: colorPalette.orange.regular,
    highlightSecondary: colorPalette.orange.light,
    spotifyGreenRegular: colorPalette.green.light,
    purchaseAction: 'forestgreen',
    error: 'firebrick'
  },
  fonts: {
    // default: fonts.facets,
    headers: fonts.nineteenTenVienna
  },
  typography: {
    h1: {
      fontWeight: 'normal',
      fontSize: '56px',
      textTransform: 'uppercase',
      color: colorPalette.orange.regular
    }
  }
}
