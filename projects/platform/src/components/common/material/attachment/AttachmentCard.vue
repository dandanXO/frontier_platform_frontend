<template lang="pug">
material-file-card(
  :attachment="attachment"
  :isReadOnly="isReadOnly"
  :menuTree="menuTree"
)
</template>

<script setup lang="ts">
import type { MenuTree } from '@frontier/ui-component'
import type { Attachment } from '@/composables/material/useAttachmentSelect'
import MaterialFileCard from '../file/MaterialFileCard.vue'

withDefaults(
  defineProps<{
    attachment: Attachment
    isReadOnly?: boolean
    menuTree: MenuTree
  }>(),
  {
    isReadOnly: false,
  }
)
</script>
