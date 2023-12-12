<template lang="pug">
material-file-card(
  :thumbnailUrl="thumbnailUrl"
  :originalUrl="originalUrl"
  :displayFileName="displayFileName"
  :extension="extension"
  :menuTree="menuTree"
)
</template>

<script setup lang="ts">
import MaterialFileCard, {
  type PropsMaterialFileCard,
} from '@/components/common/material/file/MaterialFileCard.vue'

defineProps<PropsMaterialFileCard>()
</script>
