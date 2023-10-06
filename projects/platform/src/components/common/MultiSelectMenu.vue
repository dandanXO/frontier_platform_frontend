<style lang="scss" scoped>
.menu-position {
  position: fixed;
  z-index: 150;
  right: calc((100% - 240px) / 2);
  bottom: 82px;
  transform: translateX(50%);
}
</style>

<template lang="pug">
div(
  v-if="innerSelectedList.length > 0"
  class="menu-position shadow-32 w-fit px-15 py-7.5 bg-grey-0 rounded-full text-body2 text-grey-900 flex justify-center items-center"
)
  f-svg-icon(
    iconName="cancel"
    size="24"
    class="text-grey-250 mr-4 cursor-pointer"
    @click="clearList"
  )
  i18n-t(keypath="RR0073" tag="div" class="mr-7.5" scope="global")
    template(#number) {{ innerSelectedList.length }}
  div(class="flex flex-wrap gap-y-5 divide-x w-fit max-w-127")
    template(v-for="option in optionMultiSelect" :key="option.id")
      slot(:option="option")
        div(
          class="whitespace-nowrap px-5"
          :class="[(option.disabled ? option.disabled(innerSelectedList) : false) ? 'text-grey-250' : 'cursor-pointer hover:text-primary-400']"
          @click="handleClick(option)"
        ) {{ option.name(innerSelectedList) }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FunctionOption } from '@/types'

const props = defineProps<{
  optionMultiSelect: Array<FunctionOption<any>>
  selectedList: Array<any>
}>()

const emit = defineEmits(['update:selectedList'])

const innerSelectedList = computed({
  get: () => props.selectedList,
  set: (v) => emit('update:selectedList', v),
})

const clearList = () => emit('update:selectedList', [])
const handleClick = (option: FunctionOption<any>) => {
  if (option.disabled && option.disabled(innerSelectedList.value)) {
    return
  }
  option.func(innerSelectedList.value)
}
</script>
