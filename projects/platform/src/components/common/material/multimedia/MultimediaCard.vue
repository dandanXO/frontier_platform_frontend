<template lang="pug">
material-file-card(
  :thumbnailUrl="thumbnailUrl"
  :displayFileName="fileName"
  :menuTree="menuTree"
)
  f-svg-icon(
    :class="[isCover ? 'text-primary-400' : 'text-grey-400', 'cursor-pointer']"
    iconName="star"
    size="24"
    @click.stop="emits('setCover')"
  )
</template>

<script setup lang="ts">
import MaterialFileCard from '../file/MaterialFileCard.vue'
import type { MenuTree } from '@frontier/ui-component'

defineProps<{
  isCover: boolean
  thumbnailUrl: string
  fileName: string
  menuTree: MenuTree
}>()

const emits = defineEmits<{
  (e: 'setCover'): void
}>()
</script>
