<template lang="pug">
div(ref="rootElement")
  slot
</template>

<script lang="ts">
export default {
  name: 'FScrollbarContainer',
}
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import overlayscrollbars from 'overlayscrollbars'
import 'overlayscrollbars/css/OverlayScrollbars.css'
// https://kingsora.github.io/OverlayScrollbars/#!overview

const props = withDefaults(
  defineProps<{
    /**
     * Indicates whether the host element is capable of "auto" sizes such as: width: auto and height: auto. If set to false and the property width or height is "auto", the rendered width or height of the content will be zero.
     * If you are applying OverlayScrollbars to a flexbox-element set this option to false to ensure correct functionality.
     *
     * This option is ignored if the target-element is the body element, because in this case the size must be 100% (on both axis) to simulate the viewport correctly.
     */
    sizeAutoCapable?: boolean
  }>(),
  { sizeAutoCapable: true }
)

const emit = defineEmits<{
  (e: 'reach-bottom'): void
  (e: 'scrollInfoChange', scrollInfo: overlayscrollbars.ScrollInfo): void
}>()

const rootElement = ref<HTMLDivElement>()
const instance = ref<overlayscrollbars>()

onMounted(() => {
  if (!rootElement.value) {
    throw new Error('rootElement undefined')
  }

  instance.value = overlayscrollbars(rootElement.value, {
    sizeAutoCapable: props.sizeAutoCapable,
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll',
    },
    callbacks: {
      onScroll() {
        const scrollInfo = this.scroll()
        emit('scrollInfoChange', scrollInfo)

        if (scrollInfo.ratio.y >= 0.9) {
          emit('reach-bottom')
        }
      },
      onContentSizeChanged() {
        const scrollInfo = this.scroll()
        emit('scrollInfoChange', scrollInfo)
      },
    },
  })

  emit('scrollInfoChange', instance.value.scroll())
})

defineExpose({ rootElement, instance })
</script>
