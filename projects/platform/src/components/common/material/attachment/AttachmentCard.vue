<template lang="pug">
material-file-card(
  :thumbnailUrl="thumbnailUrl"
  :displayFileName="fileName"
  :menuTree="menuTree"
)
</template>

<script setup lang="ts">
import type { MenuTree } from '@frontier/ui-component'
import MaterialFileCard from '@/components/common/material/file/MaterialFileCard.vue'

defineProps<{
  thumbnailUrl: string
  fileName: string
  menuTree?: MenuTree
}>()
</script>
