import { copyText } from '@frontier/lib'
import { SocialMedia } from '@frontier/platform-web-sdk'

const { VITE_APP_FACEBOOK_APP_ID } = import.meta.env
const SHARE_BASE_URL = `${window.location.origin}/share-page/index.html`
const SALT = 'FD4ASBERK%$^#NFG6MITR' // 自定義鹽值
const encodeToken = (token: string): string => {
  const saltedToken = `${SALT}${token}${SALT.split('').reverse().join('')}` // 在前後加鹽
  return btoa(saltedToken) // 將加鹽後的字串轉換為 Base64
}

// 解鹽的 Base64 解碼
const decodeToken = (encodedToken: string): string => {
  try {
    const saltedToken = atob(encodedToken) // 將 Base64 解碼為加鹽的字串
    if (
      !saltedToken.startsWith(SALT) ||
      !saltedToken.endsWith(SALT.split('').reverse().join(''))
    ) {
      // alert('Invalid token') // 驗證鹽值是否正確
    }
    return saltedToken.slice(SALT.length, -SALT.length) // 去掉前後的鹽值，返回原始字串
  } catch (e) {
    console.error('Base64 decode failed:', e)
    return null // 或回傳預設值
  }
}
const getSharedUrl = (sharingKey: string) =>
  `${SHARE_BASE_URL}?sharingKey=${sharingKey}&showAllToken=${encodeToken(
    sharingKey
  )}`

const getSharedUrlNormal = (sharingKey: string) =>
  `${SHARE_BASE_URL}?sharingKey=${sharingKey}`
const shareViaSocialMedia = (sharingKey: string, type: SocialMedia) => {
  const sharedUrl = getSharedUrl(sharingKey)
  let openedUrl = ''

  switch (type) {
    case SocialMedia.LINKEDIN:
      // %3D is '=', query parameters not supported in URL of LinkedIn share
      openedUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${SHARE_BASE_URL}?sharingKey%3D${sharingKey}`
      break
    case SocialMedia.FACEBOOK:
      openedUrl = `https://www.facebook.com/dialog/feed?display=page&app_id=${VITE_APP_FACEBOOK_APP_ID}&link=${sharedUrl}`
      break
    case SocialMedia.TWITTER:
      openedUrl = `https://twitter.com/share?url=${sharedUrl}`
      break
  }

  window.open(openedUrl, 'mywindow', 'popup=yes,width=570,height=746')
}

const shareViaCopyLink = (sharingKey: string) => {
  copyText(getSharedUrlNormal(sharingKey))
}

const shareShowAllViaCopyLink = (sharingKey: string) => {
  copyText(getSharedUrl(sharingKey))
}

export {
  getSharedUrlNormal,
  getSharedUrl,
  shareViaCopyLink,
  shareShowAllViaCopyLink,
  shareViaSocialMedia,
  encodeToken,
  decodeToken,
}
