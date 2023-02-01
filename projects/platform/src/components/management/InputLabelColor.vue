<template lang="pug">
f-popper(placement="bottom-end")
  template(#trigger="{ isExpand }")
    div(
      class="flex items-center gap-x-1 px-3 rounded border border-grey-150"
      :class="[size === 'lg' ? 'h-11' : 'h-9']"
    )
      label(class="w-5 h-5 rounded" :style="{ backgroundColor: innerLabelColor }")
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="20"
        class="text-grey-600 transform"
        :class="[isExpand ? '-rotate-90' : 'rotate-90']"
      )
  template(#content)
    div(
      class="w-max p-2.5 rounded bg-grey-0"
      style="box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15)"
    )
      div(class="grid grid-cols-6 grid-rows-3 gap-x-2 gap-y-1.5")
        label(
          v-for="item in labelColorList"
          :key="item.labelColor"
          class="w-5 h-5 rounded-sm relative cursor-pointer"
          :style="{ backgroundColor: item.labelColor }"
          @click="innerLabelColor = item.labelColor"
        )
          f-svg-icon(
            v-if="item.labelColor === innerLabelColor"
            iconName="done"
            size="14"
            class="text-grey-0 absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )
</template>

<script setup>
import { computed } from 'vue'
import { COLOR } from '@/utils/constants'

const emit = defineEmits(['update:labelColor'])
const props = defineProps({
  labelColor: {
    validator: (v) => true,
    required: true,
  },
  size: {
    type: String,
    default: 'lg',
  },
})
const labelColorList = computed(() =>
  Object.values(COLOR).map((color) => ({ labelColor: color }))
)

const innerLabelColor = computed({
  get: () => props.labelColor,
  set: (v) => emit('update:labelColor', v),
})
</script>
