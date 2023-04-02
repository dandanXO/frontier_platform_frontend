import { computed, unref } from 'vue'
import { STICKER_ADD_TO } from '@/utils/constants'

const useStickerEditorCreatorInfo = (organization, orgUser, addFrom, addTo) => {
  const avatar = computed(() =>
    unref(addTo) === STICKER_ADD_TO.EXTERNAL
      ? unref(organization).logo
      : unref(orgUser).avatar
  )
  const avatarType = computed(() =>
    unref(addTo) === STICKER_ADD_TO.EXTERNAL ? 'org' : 'user'
  )
  const labelColor = computed(() => unref(addFrom).labelColor)
  const primaryInfoText = computed(() => {
    if (unref(addTo) === STICKER_ADD_TO.EXTERNAL) {
      return unref(organization).orgName
    }
    return unref(orgUser).displayName
  })
  const secondaryInfoText = computed(() => unref(addFrom).name)

  return { avatar, avatarType, labelColor, primaryInfoText, secondaryInfoText }
}

export default useStickerEditorCreatorInfo
