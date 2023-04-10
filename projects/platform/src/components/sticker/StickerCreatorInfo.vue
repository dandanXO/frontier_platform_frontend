<template lang="pug">
div(class="flex flex-shrink min-w-0 items-center gap-x-2")
  f-avatar(
    :imageUrl="avatar"
    :type="avatarType"
    :labelColor="labelColor"
    size="sm"
    :hasBorder="false"
  )
  div(class="flex-shrink min-w-0")
    f-tooltip(isNotFitWidth)
      template(#trigger)
        p(
          class="whitespace-nowrap text-ellipsis overflow-hidden text-caption text-grey-900 font-bold leading-1.6"
        ) {{ creatorInfoText }}
      template(#content)
        p {{ creatorInfoText }}
span(v-if="createDate" class="flex-shrink-0 text-caption text-grey-300 font-normal") ・{{ $dayjs.unix(createDate).format('MMM DD, YYYY [at] hh:mm A') }}
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
