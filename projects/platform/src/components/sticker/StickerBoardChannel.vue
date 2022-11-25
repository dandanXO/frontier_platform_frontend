<template lang="pug">
div(
  class="cursor-pointer group w-41.5 h-10 flex justify-between items-center px-3 rounded-t-md hover:bg-grey-0"
  :class="{ 'border-t-2 border-primary-400 bg-grey-0': isActive }"
)
  div(class="relative flex items-center")
    div(class="relative flex-shrink-0")
      img(v-if="channel.orgLogo" :src="channel.orgLogo" class="w-6 h-6 rounded-full")
      slot(v-else name="logo" :isActive="isActive")
      div(v-if="isPinned" class="absolute -bottom-0.5 right-0 w-3.5")
        img(src="@/assets/images/pinned_active.png" class="w-full")
    p(
      class="line-clamp-1 !break-all text-body2 ml-2"
      :class="[isActive ? 'text-grey-900' : 'text-grey-600']"
    ) {{ channel.orgName }}
    div(
      v-if="channel.hasNewUpdate"
      class="absolute w-1.5 h-1.5 bg-primary-400 rounded-full top-0 -right-2"
    )
  div(v-if="pinable || closeable" class="grid grid-cols-2 gap-2.5 items-center")
    f-tooltip(v-if="pinable")
      template(#trigger)
        f-svg-icon(
          v-if="isPinned"
          iconName="pinned"
          size="20"
          class="cursor-pointer hidden group-hover:block text-primary-400"
          @click.stop="$emit('unpin')"
        )
        f-svg-icon(
          v-else
          iconName="pin_border"
          size="20"
          class="cursor-pointer hidden group-hover:block text-grey-600 hover:text-primary-400"
          @click.stop="$emit('pin')"
        )
      template(#content)
        p(v-if="isPinned") Unpin
        p(v-else) Pin
    f-tooltip(v-if="closeable")
      template(#trigger)
        f-svg-icon(
          iconName="archive"
          size="20"
          class="cursor-pointer hidden group-hover:block text-grey-600 hover:text-primary-400"
          @click.stop="$emit('close')"
        )
      template(#content)
        p Archive
</template>

<script setup>
const emit = defineEmits(['pin', 'unpin', 'close'])
const props = defineProps({
  channel: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  pinable: {
    type: Boolean,
    default: true,
  },
  closeable: {
    type: Boolean,
    default: true,
  },
  isAllTab: {
    type: Boolean,
    default: false,
  },
})
</script>
