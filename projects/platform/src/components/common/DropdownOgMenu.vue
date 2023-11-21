<template lang="pug">
f-select-dropdown(
  class="w-75"
  :selectValue="`${ogType}-${ogId}`"
  :dropdownMenuTree="menuOrgOrGroup"
  @update:selectValue="$emit('select', $event)"
)
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { OgType, type Organization } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'

defineEmits<{
  (e: 'select', ogKey: string): void
}>()

const store = useStore()
const { ogType, ogId } = useNavigation()

const organization = computed<Organization>(
  () => store.getters['organization/organization']
)
const menuOrgOrGroup = computed(() => {
  const { orgId, orgName, labelColor } = organization.value
  return {
    width: 'w-75',
    blockList: [
      {
        menuList: [
          {
            title: orgName,
            selectValue: `${OgType.ORG}-${orgId}`,
            labelColor,
          },
          ...organization.value.groupList.map((group) => {
            const { groupId, groupName, labelColor } = group
            return {
              title: groupName,
              selectValue: `${OgType.GROUP}-${groupId}`,
              labelColor,
            }
          }),
        ],
      },
    ],
  }
})
</script>
