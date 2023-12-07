import { createStore } from 'vuex'
import useStickerAddFromMenu from '@/composables/useStickerAddFromMenu'
import { OgType } from 'frontier/platform-web-sdk'

const mockStore = createStore({
  modules: {
    organization: {
      namespaced: true,
      getters: {
        organization: () => ({
          orgId: 10,
          orgName: 'Raven Org',
          labelColor: '#ffffff',
        }),
        groupList: () => {
          return [
            {
              groupId: 11,
              groupName: 'Raven Group 1',
              labelColor: '#000000',
            },
            {
              groupId: 12,
              groupName: 'Raven Group 2',
              labelColor: '#888888',
            },
          ]
        },
      },
    },
  },
})

vi.mock('vuex', async (importOriginal) => {
  const mod = await importOriginal<typeof import('vuex')>()
  return { ...mod, useStore: vi.fn(() => mockStore) }
})

describe('useStickerAddFromMenu', () => {
  it('should gather org & group info to stickerAddFromMenu from vuex store', () => {
    const menuAddFrom = useStickerAddFromMenu()
    expect(menuAddFrom.value.blockList[0].menuList).toEqual([
      {
        title: 'Raven Org',
        labelColor: '#ffffff',
        selectValue: {
          addFromOGId: 10,
          addFromOGType: OgType.ORG,
          name: 'Raven Org',
          labelColor: '#ffffff',
        },
      },
      {
        title: 'Raven Group 1',
        labelColor: '#000000',
        selectValue: {
          addFromOGId: 11,
          addFromOGType: OgType.GROUP,
          name: 'Raven Group 1',
          labelColor: '#000000',
        },
      },
      {
        title: 'Raven Group 2',
        labelColor: '#888888',
        selectValue: {
          addFromOGId: 12,
          addFromOGType: OgType.GROUP,
          name: 'Raven Group 2',
          labelColor: '#888888',
        },
      },
    ])
  })
})
