<template lang="pug">
f-tooltip-standard(:tooltipMessage="isPicked ? $t('QQ0029') : $t('QQ0028')")
  template(#slot:tooltip-trigger)
    div(
      class="w-6.5 h-6.5 group cursor-pointer hover:bg-primary-400/10 rounded-full flex items-center justify-center"
      @click.stop="$emit('togglePick')"
    )
      f-svg-icon(
        size="20"
        :iconName="isPicked ? 'pinned' : 'pin_border'"
        :class="[isPicked ? 'text-primary-400' : 'text-grey-600']"
        class="group-hover:text-primary-400"
      )
</template>

<script setup>
defineProps({
  isPicked: {
    type: Boolean,
    required: true,
  },
})
defineEmits(['togglePick'])
</script>
