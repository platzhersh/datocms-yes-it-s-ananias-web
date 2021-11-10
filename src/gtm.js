import TagManager from 'react-gtm-module'

/**
 * Google Tag Manager Init Script
 */
export default function initGtm() {
  const tagManagerArgs = {
    gtmId: process.env.REACT_APP_GTM_ID ?? undefined,
  }
  window['gtmId'] = tagManagerArgs.gtmId

  if (tagManagerArgs.gtmId) {
    TagManager.initialize(tagManagerArgs)
  }
}
