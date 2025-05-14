<!-- components/AnimatedNumber.vue -->
<template>
  <span ref="el" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { CountUp } from 'countup.js'

const props = defineProps({
  endVal: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    default: 2,
  },
  startVal: {
    type: Number,
    default: 0,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const el = ref(null)
let countUpInstance

const animate = () => {
  if (!el.value) {
    return
  }
  countUpInstance = new CountUp(el.value, props.endVal, {
    startVal: props.startVal,
    duration: props.duration,
    ...props.options,
  })
  countUpInstance.start()
}

onMounted(animate)

watch(
  () => props.endVal,
  (newVal) => {
    if (countUpInstance) {
      countUpInstance.update(newVal)
    } else {
      animate()
    }
  }
)
</script>
