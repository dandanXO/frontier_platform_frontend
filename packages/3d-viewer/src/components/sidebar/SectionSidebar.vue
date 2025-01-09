<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row gap-3 justify-between items-center">
      <h5 class="text-lg font-bold">{{ title }}</h5>
      <f-svg-icon
        :iconName="`chevron_${isShowContent ? 'up' : 'down'}`"
        size="24"
        @click="toggleContent"
        class="cursor-pointer"
      />
    </div>
    <div
      ref="contentWrapper"
      class="flex flex-col gap-4 transition-height"
      :style="{ height: wrapperHeight }"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  title: string
}

const isShowContent = ref(true)
const wrapperHeight = ref('auto')
const contentWrapper = ref<HTMLElement | null>(null)

const toggleContent = () => {
  isShowContent.value = !isShowContent.value
}

watch(isShowContent, (isExpand) => {
  if (contentWrapper.value) {
    // Ensure starting height
    const fullHeight = contentWrapper.value.scrollHeight
    wrapperHeight.value = `${fullHeight}px`

    /**
     * if expand, Match the timeout value with CSS transation (0.5s = 500)
     * if colapsed, set timeout to 0, so the CSS animation can run
     */
    const timeout = isExpand ? 500 : 0
    setTimeout(() => {
      wrapperHeight.value = isExpand ? 'auto' : '0px'
    }, timeout)
  }
})

defineProps<Props>()
</script>

<style scoped>
.transition-height {
  transition: height 0.5s ease-in-out;
  overflow: hidden;
}
</style>
