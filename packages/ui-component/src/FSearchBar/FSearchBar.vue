<template lang="pug">
div(class="justify-self-center bg-primary flex items-center" :class="[dynamicWidth]")
  div(
    class="flex-grow flex items-center pl-3 pr-2 gap-2 text-primary-inverse h-full border border-primary-border rounded-l"
    :class="[{ 'shadow-focus': isFocusedInput }, rightIcon ? 'rounded-l' : 'rounded']"
    data-cy="search-box"
  )
    f-svg-icon(class="pr-1" size="24" iconName="search")
    input(
      type="text"
      :value="keyword"
      :placeholder="placeholder ?? $t('RR0053')"
      @input="$emit('typing', $event)"
      @focus="isFocusedInput = true"
      @blur="isFocusedInput = false"
      @keydown.enter="$emit('search')"
      class="placeholder:text-grey-600-v1 placeholder:overflow-visible flex-grow w-full outline-none bg-transparent overflow-hidden text-grey-900 text-body1 disabled:text-grey-600"
    )
    f-svg-icon(
      v-if="!!keyword"
      size="24"
      iconName="cancel"
      class="cursor-pointer"
      @click="$emit('clear')"
    )
  div(
    class="flex items-center px-4 py-2 hover:bg-primary-hover cursor-pointer border-r border-t border-b border-primary-border rounded-r"
    @click="$emit('clickRightIcon')"
    v-if="rightIcon"
  )
    f-svg-icon(
      size="24"
      :iconName="rightIcon"
      class="self-center"
      :tooltipMessage="rightIconTooltipMessage"
    )
</template>

<script lang="ts">
export default {
  name: 'FSearchBar',
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useBreakpoints } from '@frontier/lib'

const { isDesktop } = useBreakpoints()
const isFocusedInput = ref(false)
const dynamicWidth = computed(() => {
  return isDesktop.value ? 'max-w-192 min-w-112' : 'max-w-[370px] min-w-80'
})

defineProps<{
  keyword: string | null
  rightIcon?: string
  rightIconTooltipMessage?: string
  placeholder?: string
}>()

defineEmits<{
  (e: 'clickRightIcon'): void
  (e: 'clear'): void
  (e: 'typing', value: Event): void
  (e: 'search'): void
}>()
</script>

<style lang="scss" scoped>
.shadow-focus {
  box-shadow: 0px 0px 0px 2px #8addf4;
  transition: box-shadow 0.2s ease;
}
</style>
