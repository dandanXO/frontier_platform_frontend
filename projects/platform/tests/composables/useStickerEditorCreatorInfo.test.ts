import useStickerEditorCreatorInfo from '@/composables/useStickerEditorCreatorInfo'
import { STICKER_ADD_TO } from '@/utils/constants'

describe('useStickerEditorCreatorInfo', () => {
  const organization = {
    logo: 'https://raven-org-log.png',
    orgName: 'Raven Org',
  }

  const orgUser = {
    avatar: 'https://raven-avatar.png',
    displayName: 'Raven',
  }

  const addFrom = {
    labelColor: '#ffffff',
    name: 'Raven Group 1',
  }

  it('should handle internal sticker editor creator info', () => {
    const addTo = STICKER_ADD_TO.INTERNAL

    const {
      avatar,
      avatarType,
      labelColor,
      primaryInfoText,
      secondaryInfoText,
    } = useStickerEditorCreatorInfo(organization, orgUser, addFrom, addTo)

    expect(avatar.value).toEqual(orgUser.avatar)
    expect(avatarType.value).toEqual('user')
    expect(labelColor.value).toEqual(addFrom.labelColor)
    expect(primaryInfoText.value).toEqual(orgUser.displayName)
    expect(secondaryInfoText.value).toEqual(addFrom.name)
  })

  it('should handle external sticker editor creator info', () => {
    const addTo = STICKER_ADD_TO.EXTERNAL

    const {
      avatar,
      avatarType,
      labelColor,
      primaryInfoText,
      secondaryInfoText,
    } = useStickerEditorCreatorInfo(organization, orgUser, addFrom, addTo)

    expect(avatar.value).toEqual(organization.logo)
    expect(avatarType.value).toEqual('org')
    expect(labelColor.value).toEqual(addFrom.labelColor)
    expect(primaryInfoText.value).toEqual(organization.orgName)
    expect(secondaryInfoText.value).toEqual(addFrom.name)
  })
})
