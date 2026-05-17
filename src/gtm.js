import TagManager from 'react-gtm-module'

export default function initGtm() {
  const gtmId = import.meta.env.VITE_APP_GTM_ID
  if (gtmId) TagManager.initialize({ gtmId })
}
