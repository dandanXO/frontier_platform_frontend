import useStickerLocationList from '@/composables/useStickerLocationList'
import { useRoute } from 'vue-router'
import type { Mock } from 'vitest'

vi.mock('vue-router')

describe('useStickerLocationList', () => {
  it('should handle Public Library material(not inside collection) location list', () => {
    ;(useRoute as Mock).mockReturnValue({ path: 'public-library' })

    const stickerLocationList = useStickerLocationList(null)
    expect(stickerLocationList.value).toEqual([])
  })

  it('should handle Public Library material(inside collection) location list', () => {
    ;(useRoute as Mock).mockReturnValue({
      path: 'public-library/nodeId',
    })

    const stickerLocationList = useStickerLocationList([
      'Public Library',
      'collection A',
      'collection B',
      'material No',
    ])
    expect(stickerLocationList.value).toEqual(['collection A', 'collection B'])
  })

  it('should handle Showroom material location list', () => {
    ;(useRoute as Mock).mockReturnValue({ path: 'showroom/nodeId' })

    const stickerLocationList = useStickerLocationList([
      'Public Library',
      'collection A',
      'collection B',
      'material No',
    ])
    expect(stickerLocationList.value).toEqual(['collection A', 'collection B'])
  })

  it('should handle Workspace material location list', () => {
    ;(useRoute as Mock).mockReturnValue({
      path: 'workspace/nodeId',
    })

    const stickerLocationList = useStickerLocationList([
      'Workspace',
      'collection A',
      'collection B',
      'material No',
    ])
    expect(stickerLocationList.value).toEqual(['collection A', 'collection B'])
  })

  it('should handle Mood Boards material location list', () => {
    ;(useRoute as Mock).mockReturnValue({ path: 'moodboard/rest-path' })

    const stickerLocationList = useStickerLocationList([
      'Mood Boards',
      'collection A',
      'collection B',
      'material No',
    ])
    expect(stickerLocationList.value).toEqual(['collection A', 'collection B'])
  })

  it('should handle Shared with me material location list', () => {
    ;(useRoute as Mock).mockReturnValue({
      path: 'share-to-me/sharingId/nodeId',
    })

    const stickerLocationList = useStickerLocationList([
      'Shared with me',
      'collection A',
      'collection B',
      'material No',
    ])
    expect(stickerLocationList.value).toEqual(['collection A', 'collection B'])
  })

  it('should handle Received Share material location list', () => {
    ;(useRoute as Mock).mockReturnValue({
      path: 'received-share/sharingKey/nodeId',
    })

    const stickerLocationList = useStickerLocationList([
      'collection A',
      'collection B',
      'material No',
    ])
    expect(stickerLocationList.value).toEqual(['collection A', 'collection B'])
  })

  it('should handle Embed material location list', () => {
    ;(useRoute as Mock).mockReturnValue({ path: 'embed/sharingKey/nodeId' })

    const stickerLocationList = useStickerLocationList([
      'collection A',
      'collection B',
      'material No',
    ])
    expect(stickerLocationList.value).toEqual(['collection A', 'collection B'])
  })
})
