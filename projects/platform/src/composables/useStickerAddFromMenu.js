import { computed } from 'vue'
import { useStore } from 'vuex'
import { OG_TYPE } from '@/utils/constants'

const useStickerAddFromMenu = () => {
  const store = useStore()
  const organization = computed(
    () => store.getters['organization/organization']
  )
  const menuAddFrom = computed(() => {
    const { orgName, orgId, labelColor } = organization.value

    return {
      width: 'w-73.5',
      blockList: [
        {
          menuList: [
            {
              title: orgName,
              selectValue: {
                addFromOGId: orgId,
                addFromOGType: OG_TYPE.ORG,
                name: orgName,
                labelColor,
              },
              labelColor,
            },
            ...store.getters['organization/groupList'].map((group) => {
              const { groupId, groupName, labelColor } = group
              return {
                title: groupName,
                selectValue: {
                  addFromOGId: groupId,
                  addFromOGType: OG_TYPE.GROUP,
                  name: groupName,
                  labelColor,
                },
                labelColor,
              }
            }),
          ],
        },
      ],
    }
  })

  return menuAddFrom
}

export default useStickerAddFromMenu
