<template lang="pug">
div(
  class="justify-self-center h-10 bg-primary border border-primary-border rounded flex items-center overflow-hidden"
  :class="dynamicWidth"
)
  div(
    class="flex-grow flex items-center pl-3 pr-2 gap-2 text-primary-inverse border-r border-primary-border h-full"
    data-cy="search-box"
  )
    f-svg-icon(class="pr-1" size="24" iconName="search")
    input(
      type="text"
      :value="keyword"
      :placeholder="placeholder ?? $t('RR0053')"
      @input="typing"
      @keydown.enter="handleSearch"
      class="placeholder:text-grey-250 placeholder:overflow-visible flex-grow w-full outline-none bg-transparent overflow-hidden text-grey-900 text-body1 disabled:text-grey-600"
    )
    f-svg-icon(
      v-if="!!keyword"
      size="24"
      iconName="clear"
      class="cursor-pointer"
      @click="onClear"
    )
  div(class="flex items-center px-4 py-2 hover:bg-primary-hover")
    f-svg-icon(
      size="24"
      v-if="rightIcon"
      :iconName="rightIcon"
      class="cursor-pointer self-center"
      @click="onClickRightIcon"
      :tooltipMessage="rightIconTooltipMessage"
    )
</template>

<script lang="ts">
export default {
  name: 'FSearchBar',
}
</script>

<script lang="ts" setup>
import { useBreakpoints } from '@frontier/lib'
import { computed } from 'vue'
const { isDesktop } = useBreakpoints()

const dynamicWidth = computed(() => {
  return isDesktop.value ? 'max-w-192 min-w-112' : 'max-w-[370px] min-w-80'
})

defineProps<{
  keyword: string | null
  typing: (e: Event) => void
  handleSearch: () => void
  onClear: () => void
  onClickRightIcon?: () => void
  rightIcon?: string
  rightIconTooltipMessage?: string
  placeholder?: string
}>()
</script>
