<template lang="pug">
f-popper(theme="dark" placement="bottom-start" :offset="[0, -4]")
  template(#trigger="{ isExpand }")
    div(
      class="flex items-center gap-x-1 px-3 rounded border hover:bg-grey-800 cursor-pointer"
      :class="['h-7', isExpand ? 'border-primary-500 bg-grey-700' : 'border-grey-700 bg-grey-900']"
      :style="{ 'box-shadow': isExpand ? '0px 0px 0px 2px rgba(3, 57, 62, 0.85)' : '' }"
    )
      label(
        class="w-3 h-3 border border-grey-600 rounded-sm"
        :style="{ backgroundColor: innerLabelColor }"
      )
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="20"
        class="text-grey-500 transform"
        :class="[isExpand ? '-rotate-90' : 'rotate-90']"
      )
  template(#content="{ isExpand }")
    div(
      class="w-max p-2.5 rounded bg-grey-800"
      :style="{ 'box-shadow': isExpand ? '0px 1.5px 3.6px rgba(38, 38, 38, 0.24), 0px 6px 14.4px rgba(38, 38, 38, 0.24)' : '' }"
    )
      div(class="grid grid-cols-7 grid-rows-2 gap-x-2 gap-y-1.5")
        label(
          v-for="item in labelColorList"
          :key="item.labelColor"
          class="w-5 h-5 relative border border-grey-600 rounded-sm cursor-pointer"
          :style="{ backgroundColor: item.labelColor }"
          @click="innerLabelColor = item.labelColor"
        )
          f-svg-icon(
            v-if="item.labelColor === innerLabelColor"
            iconName="done"
            size="14"
            class="absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            :class="[item.invertContent ? 'text-grey-600' : 'text-grey-0']"
          )
</template>

<script setup>
import { computed } from 'vue'
import { CROPPER_GRID_COLORS } from '@/utils/constants'

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
  CROPPER_GRID_COLORS.map((c) => ({
    labelColor: c.color,
    invertContent: c.invertContent,
  }))
)

const innerLabelColor = computed({
  get: () => props.labelColor,
  set: (v) => emit('update:labelColor', v),
})
</script>
