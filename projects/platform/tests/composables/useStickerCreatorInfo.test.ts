import useStickerCreatorInfo from '@/composables/useStickerCreatorInfo'
import { STICKER_ADD_TO } from '@/utils/constants'

describe('useStickerCreatorInfo', () => {
  const basedSticker = {
    creator: 'Raven',
    creatorOrgName: 'Raven Org',
    creatorUnitLogo: 'https://raven-org-logo.png',
    creatorAvatar: 'https://raven-avatar.png',
    createDate: '2023-01-01:00:00:00',
  }

  it('should handle internal sticker creator info', () => {
    const sticker = {
      ...basedSticker,
      addTo: STICKER_ADD_TO.INTERNAL,
      creatorUnitLabelColor: '#fffff',
    }

    const { avatar, avatarType, labelColor, creatorInfoText, createDate } =
      useStickerCreatorInfo(sticker)

    expect(avatar.value).toEqual(sticker.creatorAvatar)
    expect(avatarType.value).toEqual('user')
    expect(labelColor.value).toEqual(sticker.creatorUnitLabelColor)
    expect(creatorInfoText.value).toEqual(sticker.creator)
    expect(createDate.value).toEqual(sticker.createDate)
  })

  it('should handle external sticker creator info', () => {
    const sticker = {
      ...basedSticker,
      addTo: STICKER_ADD_TO.EXTERNAL,
      creatorUnitLabelColor: null,
    }

    const { avatar, avatarType, labelColor, creatorInfoText, createDate } =
      useStickerCreatorInfo(sticker)

    expect(avatar.value).toEqual(sticker.creatorUnitLogo)
    expect(avatarType.value).toEqual('org')
    expect(labelColor.value).toEqual('')
    expect(creatorInfoText.value).toEqual(sticker.creatorOrgName)
    expect(createDate.value).toEqual(sticker.createDate)
  })
})
