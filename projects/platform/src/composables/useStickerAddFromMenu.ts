import { computed } from 'vue'
import { useStore } from 'vuex'
import { OgType } from '@frontier/platform-web-sdk'
import type { Organization } from '@frontier/platform-web-sdk'

const useStickerAddFromMenu = () => {
  const store = useStore()
  const organization = computed(
    () => store.getters['organization/organization'] as Organization
  )

  const menuAddFrom = computed(() => {
    const { orgName, orgId, labelColor } = organization.value
    const groupList = store.getters[
      'organization/groupList'
    ] as Organization['groupList']

    let menuList = [
      {
        title: orgName,
        selectValue: {
          addFromOGId: orgId,
          addFromOGType: OgType.ORG as OgType,
          name: orgName,
          labelColor,
        },
        labelColor,
      },
    ]

    if (groupList) {
      menuList = [
        ...menuList,
        ...groupList.map((group) => {
          const { groupId, groupName, labelColor } = group
          return {
            title: groupName,
            selectValue: {
              addFromOGId: groupId,
              addFromOGType: OgType.GROUP,
              name: groupName,
              labelColor,
            },
            labelColor,
          }
        }),
      ]
    }

    return {
      width: 'w-73.5',
      blockList: [{ menuList }],
    }
  })

  return menuAddFrom
}

export default useStickerAddFromMenu
