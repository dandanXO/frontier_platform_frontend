<template lang="pug">
f-avatar(
  :imageUrl="avatar"
  :type="avatarType"
  :labelColor="labelColor"
  size="sm"
)
p(class="text-caption text-grey-900 font-bold leading-1.6") {{ creatorInfoText }}
  span(v-if="createDate" class="text-caption text-grey-300 font-normal") ・{{ $dayjs.unix(createDate).format('MMM DD, YYYY [at] hh:mm A') }}
</template>

<script setup lang="ts">
defineProps<{
  avatar: string
  avatarType: string
  labelColor: string
  creatorInfoText: string
  createDate: number
}>()
</script>

<style scoped></style>
