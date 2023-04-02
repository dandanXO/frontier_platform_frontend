<template lang="pug">
div(class="flex-grow pr-3.5 flex items-center gap-x-3")
  f-avatar(
    :imageUrl="avatar"
    :type="avatarType"
    :labelColor="labelColor"
    size="sm"
  )
  div
    p(class="text-caption text-grey-900 font-bold leading-1.6") {{ primaryInfoText }}
    p(class="text-caption text-grey-600 leading-1.6") {{ secondaryInfoText }}
</template>

<script setup lang="ts">
defineProps<{
  avatar: string
  avatarType: string
  labelColor: string
  primaryInfoText: string
  secondaryInfoText: string
}>()
</script>

<style scoped></style>
