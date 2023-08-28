import { SOCIAL_MEDIA_TYPE } from '@/utils/constants'
import { copyText } from '@frontier/utils'

const { VITE_APP_FACEBOOK_APP_ID } = import.meta.env
const SHARE_BASE_URL = `${window.location.origin}/share-page/index.html`
const getSharedUrl = (sharingKey) =>
  `${SHARE_BASE_URL}?sharingKey=${sharingKey}`

const shareViaSocialMedia = (sharingKey, type) => {
  const sharedUrl = getSharedUrl(sharingKey)
  let openedUrl = ''

  switch (type) {
    case SOCIAL_MEDIA_TYPE.LINKEDIN:
      // %3D is '=', query parameters not supported in URL of LinkedIn share
      openedUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${SHARE_BASE_URL}?sharingKey%3D${sharingKey}`
      break
    case SOCIAL_MEDIA_TYPE.FACEBOOK:
      openedUrl = `https://www.facebook.com/dialog/feed?display=page&app_id=${VITE_APP_FACEBOOK_APP_ID}&link=${sharedUrl}`
      break
    case SOCIAL_MEDIA_TYPE.TWITTER:
      openedUrl = `https://twitter.com/share?url=${sharedUrl}`
      break
  }

  window.open(openedUrl, 'mywindow', 'popup=yes,width=570,height=746')
}

const shareViaCopyLink = (sharingKey) => {
  copyText(getSharedUrl(sharingKey))
}

export { shareViaCopyLink, shareViaSocialMedia }
