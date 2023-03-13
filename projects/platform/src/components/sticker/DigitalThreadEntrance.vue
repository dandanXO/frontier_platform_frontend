<template lang="pug">
f-tooltip
  template(#trigger)
    div(
      class="relative cursor-pointer w-12 h-7.5 rounded border border-grey-150 hover:bg-grey-100 text-grey-600 flex items-center justify-center gap-x-2"
      :class="[isHover ? 'bg-grey-0' : 'bg-grey-0/80']"
    )
      f-svg-icon(iconName="sticker_thread" size="20")
      span(class="text-caption") {{ digitalThreadQty }}
      div(
        v-if="digitalThreadHasUnread"
        class="w-2 h-2 rounded-full bg-primary-400 absolute -top-0.5 -right-0.5"
      )
  template(#content)
    p {{ $t('TT0001') }}
</template>

<script setup>
const props = defineProps({
  isHover: {
    type: Boolean,
    default: false,
  },
  digitalThreadQty: {
    type: Number,
    required: true,
  },
  digitalThreadHasUnread: {
    type: Boolean,
    required: true,
  },
})
</script>
