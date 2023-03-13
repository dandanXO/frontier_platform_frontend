<template lang="pug">
div(
  :class="bgColor"
  class="relative w-fit h-5.5 px-2.5 flex items-center gap-x-1.5 text-grey-0 rounded-[20px]"
)
  f-svg-icon(:iconName="icon" size="14")
  p(class="text-caption") {{ text }}
</template>

<script setup>
import { computed } from 'vue'
import { STICKER_ADD_TO } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { EXTERNAL, INTERNAL } = STICKER_ADD_TO

const props = defineProps({
  addTo: {
    type: Number,
    required: true,
  },
})

const bgColor = computed(() => {
  switch (props.addTo) {
    case EXTERNAL:
      return 'bg-forestgreen-300'
    case INTERNAL:
      return 'bg-grey-300'
  }
})

const icon = computed(() => {
  switch (props.addTo) {
    case EXTERNAL:
      return 'external'
    case INTERNAL:
      return 'internal'
  }
})

const text = computed(() => {
  switch (props.addTo) {
    case EXTERNAL:
      return t('TT0009')
    case INTERNAL:
      return t('TT0010')
  }
})
</script>
