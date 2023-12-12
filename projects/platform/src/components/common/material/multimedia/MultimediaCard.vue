<template lang="pug">
material-file-card(
  :thumbnailUrl="thumbnailUrl"
  :originalUrl="originalUrl"
  :extension="extension"
  :displayFileName="displayFileName"
  :menuTree="menuTree"
)
  div(class="flex flex-row gap-x-1 p-1")
    f-svg-icon(
      :class="[isCover ? 'text-primary-400' : 'text-grey-400', 'cursor-pointer']"
      iconName="star"
      size="24"
      @click.stop="emits('setCover')"
    )
    f-svg-icon(
      class="text-grey-400 cursor-pointer"
      iconName="create"
      size="24"
      @click.stop="emits('edit')"
    )
</template>

<script setup lang="ts">
import MaterialFileCard from '../file/MaterialFileCard.vue'
import type { MenuTree } from '@frontier/ui-component'
import type { Extension } from '@frontier/platform-web-sdk'

defineProps<{
  isCover: boolean
  thumbnailUrl: string | null
  originalUrl: string | null
  extension: Extension
  displayFileName: string
  menuTree: MenuTree
}>()

const emits = defineEmits<{
  (e: 'setCover'): void
  (e: 'edit'): void
}>()
</script>
