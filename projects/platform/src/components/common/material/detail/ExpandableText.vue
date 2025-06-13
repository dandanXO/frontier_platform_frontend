<template lang="pug">
div(class="flex flex-col gap-1")
  p(
    ref="descriptionContentRef"
    :class="[{ 'line-clamp-2': !isExpanded }, containerClass]"
    :style="style"
  ) 
    slot

  //- See all toggle button
  div(class="see-all-container mt-1" v-if="hasOverflow && !isExpanded")
    f-button(
      type="text"
      @click.prevent="toggleExpand"
      class="underline font-semibold text-sm"
    ) {{ $t('RR0567') }}
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

defineProps<{
  containerClass?: string
}>()

const isExpanded = ref(false)
const descriptionContentRef = ref<HTMLElement | null>(null)
const hasOverflow = computed(
  () =>
    descriptionContentRef.value &&
    descriptionContentRef.value.scrollHeight >
      descriptionContentRef.value.clientHeight
)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
const style = ref({
  transition: 'max-height 0.3s ease',
  maxHeight: '3rem', // default height for 2 lines
})

// Watch for expand toggle
watch(isExpanded, async (val) => {
  const el = descriptionContentRef.value
  if (!el) {
    return
  }

  // Temporarily remove line-clamp to measure full height
  if (val) {
    const fullHeight = el.scrollHeight + 'px'
    el.classList.add('line-clamp-2')

    // Animate from current to full height
    style.value.maxHeight = el.scrollHeight + 'px'
    await nextTick()
    requestAnimationFrame(() => {
      el.classList.remove('line-clamp-2')
      style.value.maxHeight = fullHeight
    })
  } else {
    const fullHeight = el.scrollHeight + 'px'
    style.value.maxHeight = fullHeight
    await nextTick()
    requestAnimationFrame(() => {
      el.classList.add('line-clamp-2')
      style.value.maxHeight = '3rem'
    })
  }
})
</script>
