import TagManager from 'react-gtm-module'

/**
 * Google Tag Manager Init Script
 */
export default async function initGtm() {
  const tagManagerArgs = {
    gtmId: import.meta.env.VITE_APP_GTM_ID ?? undefined,
  } as any
  (window as any).gtmId = tagManagerArgs.gtmId

  if (tagManagerArgs.gtmId) {
    TagManager.initialize(tagManagerArgs)
  }
}
