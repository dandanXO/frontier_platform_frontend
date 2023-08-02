<template lang="pug">
div(
  class="border rounded bg-grey-100/90 px-4 py-3 flex flex-row items-center justify-center gap-x-4"
)
  f-svg-icon(iconName="warning_amber_round" size="16" class="text-red-400")
  span(class="text-bold text-caption text-grey-900 leading-1.6")
    slot
</template>
