import { computed, unref } from 'vue'
import { STICKER_ADD_TO } from '@/utils/constants'
import type { Sticker } from '@frontier/platform-web-sdk'

// Sticker 還沒跟後端對 swagger required 欄位，故先加上 required
const useStickerCreatorInfo = (sticker: Required<Sticker>) => {
  const avatar = computed(() =>
    unref(sticker).addTo === STICKER_ADD_TO.EXTERNAL
      ? sticker.creatorUnitLogo
      : sticker.creatorAvatar
  )
  const avatarType = computed(() =>
    unref(sticker).addTo === STICKER_ADD_TO.EXTERNAL ? 'org' : 'user'
  )
  const labelColor = computed(() => {
    const creatorUnitLabelColor = unref(sticker).creatorUnitLabelColor
    if (creatorUnitLabelColor === null) return ''
    return creatorUnitLabelColor
  })
  const creatorInfoText = computed(() => {
    if (unref(sticker).addTo === STICKER_ADD_TO.EXTERNAL) {
      return unref(sticker).creatorOrgName
    }
    return unref(sticker).creator
  })
  const createDate = computed(() => unref(sticker).createDate)

  return { avatar, avatarType, labelColor, creatorInfoText, createDate }
}

export default useStickerCreatorInfo
