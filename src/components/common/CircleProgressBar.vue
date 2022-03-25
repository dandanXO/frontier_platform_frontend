<template lang="pug">
div(class="relative")
  svg(:width="size" :height="size")
    circle(
      :cx="size / 2"
      :cy="size / 2"
      :r="size / 2 - 2.5"
      fill="transparent"
      class="stroke-5"
      :class="secondaryColor"
      stroke-dashoffset="0"
      :stroke-dasharray="strokeDasharray"
    )
    circle(
      :cx="size / 2"
      :cy="size / 2"
      :r="size / 2 - 2.5"
      fill="transparent"
      class="stroke-5"
      :class="primaryColor"
      :transform="`rotate(-90) translate(${-size}, 0)`"
      :stroke-dasharray="strokeDasharray"
      :stroke-dashoffset="strokeDashoffset"
    )
  div(class="absolute inset-0 flex justify-center items-center")
    slot
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'CircleProgressBar',
  props: {
    size: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    primaryColor: {
      type: String,
      default: 'stroke-brand'
    },
    secondaryColor: {
      type: String,
      default: 'stroke-primary-middle'
    }
  },
  setup (props) {
    const strokeDasharray = computed(() => {
      const r = props.size / 2 - 2.5
      return 2 * r * Math.PI
    })
    const strokeDashoffset = computed(() => {
      const { max, current } = props

      if (current <= 0) {
        return strokeDasharray.value
      } else if (current >= max) {
        return 0
      } else {
        return (max - current) / max * strokeDasharray.value
      }

    })
    return {
      strokeDasharray,
      strokeDashoffset
    }
  }
}
</script>
