<template>
  <div
    class="grid grid-cols-12 gap-12 py-5 overflow-hidden max-w-405 lg:gap-14 2xl:px-14 hover:bg-grey-50"
  >
    <row-item-content
      :material="material"
      :materialOptions="materialOptions"
      :selectedList="selectedList"
      @update:selectedList="emit('update:selectedList', $event)"
      :canEdit="rolePermission && !disabled"
      :isLoading="disabled"
    >
      <template #slot:action>
        <digital-thread-entrance
          :material="material"
          :drawerOpenFromLocationList="[]"
        />
      </template>
    </row-item-content>
    <row-item-sidebar
      :material="material"
      class="col-span-1"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import RowItemSidebar from '@/components/assets/RowItemSidebar.vue'
import RowItemContent from '@/components/common/rowItem/RowItemContent.vue'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import type { Material, MaterialOptions } from '@frontier/platform-web-sdk'
import { FUNC_ID, PERMISSION_MAP } from '@/utils/constants'

defineProps<{
  selectedList: Material[]
  material: Material
  materialOptions?: MaterialOptions
  disabled?: boolean
}>()
const store = useStore()

const rolePermission = computed(() => {
  const roleId = store.getters['organization/orgUser/orgUser'].roleID
  const permissionList = PERMISSION_MAP[roleId]
  return permissionList.includes(FUNC_ID.ASSET_EDIT)
})
const emit = defineEmits<{
  (e: 'update:selectedList', v: Material[]): void
}>()
</script>
