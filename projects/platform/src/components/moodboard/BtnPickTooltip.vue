<template lang="pug">
f-tooltip
  template(#trigger)
    div(
      class="w-6.5 h-6.5 group cursor-pointer hover:bg-brand/10 rounded-full flex items-center justify-center"
      @click.stop="$emit('togglePick')"
    )
      f-svg-icon(
        size="20"
        :iconName="isPicked ? 'pinned' : 'pin_border'"
        :class="[isPicked ? 'text-brand' : 'text-black-800']"
        class="group-hover:text-brand"
      )
  template(#content)
    p {{ isPicked ? $t('QQ0029') : $t('QQ0028') }}
</template>

<script setup>
defineProps({
  isPicked: {
    type: Boolean,
    required: true
  }
})
defineEmits(['togglePick'])
</script>
