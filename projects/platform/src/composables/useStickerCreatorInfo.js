import { computed, unref } from 'vue'
import { STICKER_ADD_TO } from '@/utils/constants'

const useStickerCreatorInfo = (sticker) => {
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
