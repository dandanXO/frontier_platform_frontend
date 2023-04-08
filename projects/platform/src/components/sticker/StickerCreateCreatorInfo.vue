<template lang="pug">
div(class="flex-grow flex-shrink min-w-0 pr-3.5 flex items-center gap-x-3")
  f-avatar(
    :imageUrl="avatar"
    :type="avatarType"
    :labelColor="labelColor"
    size="sm"
  )
  div(class="flex-shrink min-w-0")
    f-tooltip(isNotFitWidth)
      template(#trigger)
        p(
          class="whitespace-nowrap text-ellipsis overflow-hidden text-caption text-grey-900 font-bold leading-1.6"
        ) {{ primaryInfoText }}
      template(#content)
        p {{ primaryInfoText }}
    f-tooltip(isNotFitWidth)
      template(#trigger)
        p(
          class="whitespace-nowrap text-ellipsis overflow-hidden text-caption text-grey-600 leading-1.6"
        ) {{ secondaryInfoText }}
      template(#content)
        p {{ secondaryInfoText }}
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
