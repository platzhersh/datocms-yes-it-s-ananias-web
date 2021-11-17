import { colorPalette } from './colorPalette'
import { fonts } from './fonts'

export const theme = {
  colors: {
    ...colorPalette,
    highlightPrimary: colorPalette.orange.regular,
    highlightSecondary: colorPalette.orange.light,
    spotifyGreenRegular: colorPalette.green.light,
  },
  fonts: {
    // default: fonts.facets,
    headers: fonts.nineteenTenVienna,
  },
  fontSizes: {},
}
