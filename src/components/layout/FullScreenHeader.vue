<template lang="pug">
div(
  ref="root"
  class="fixed inset-0 z-index:header w-screen h-16 bg-black-0 px-36 flex justify-between items-center transition duration-300 ease-in"
  :class="{ 'header-shadow': isScrolling }"
)
  div(class="flex items-center")
    h5(v-if="title !== ''" class="text-h5 text-primary font-bold") {{title}}
    slot(name="left")
  btn-group(
    :primaryButton="primaryButton"
    :primaryText="primaryText"
    :secondaryButton="secondaryButton"
    :secondaryText="secondaryText"
    @click:primary="$emit('click:primary')"
    @click:secondary="$emit('click:secondary')"
  )
</template>

<script>
import { onMounted } from '@vue/runtime-core'
import { ref } from 'vue'

export default {
  name: 'FullscreenHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    primaryButton: {
      type: Boolean,
      default: true
    },
    primaryText: {
      type: String,
      default: ''
    },
    secondaryButton: {
      type: Boolean,
      default: true
    },
    secondaryText: {
      type: String,
      default: ''
    }
  },
  emits: ['click:primary', 'click:secondary'],
  setup () {
    const root = ref(null)
    const isScrolling = ref(false)

    onMounted(() => {
      const container = root.value.parentElement
      container.addEventListener('scroll', () => {
        isScrolling.value = container.scrollTop > 0
      })
    })

    return {
      root,
      isScrolling
    }
  }
}
</script>
