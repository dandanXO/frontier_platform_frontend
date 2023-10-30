<template lang="pug">
material-file-card(
  :attachment="multimedia"
  :isReadOnly="isReadOnly"
  :menuTree="menuTree"
)
  f-svg-icon(
    :class="[multimedia.isCover ? 'text-primary-400' : 'text-grey-400', 'cursor-pointer']"
    iconName="star"
    size="24"
    @click.stop="emits('setCover')"
  )
</template>

<script setup lang="ts">
import type { Multimedia } from '@/composables/material/useMultimediaSelect'
import MaterialFileCard from '../file/MaterialFileCard.vue'
import type { MenuTree } from '@frontier/ui-component'

withDefaults(
  defineProps<{
    multimedia: Multimedia
    menuTree: MenuTree
    isReadOnly?: boolean
  }>(),
  { isReadOnly: false }
)

const emits = defineEmits<{
  (e: 'setCover'): void
}>()
</script>
