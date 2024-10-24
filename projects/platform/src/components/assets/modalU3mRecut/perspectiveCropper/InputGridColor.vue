<template lang="pug">
f-popper(placement="bottom-start" :offset="[0, -4]")
  template(#trigger="{ isExpand }")
    div(
      class="flex items-center gap-x-1 px-3 rounded border hover:bg-grey-850 hover:border-grey-600 cursor-pointer justify-between"
      :class="['h-7', isExpand ? 'border-primary-300 bg-grey-700 shadow-[0_0_0_2px_#074E54]' : 'border-grey-700 bg-grey-900']"
    )
      div(class="flex flex-row gap-2 justify-center align-middle")
        label(
          class="w-3 h-3 border border-grey-600 rounded-sm self-center"
          :style="{ backgroundColor: innerLabelColor }"
        )
        p(v-if="textColor" class="text-sm") {{ textColor }}
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="20"
        class="text-grey-250 transform"
        :class="[isExpand ? '-rotate-90' : 'rotate-90']"
      )
  template(#content="{ isExpand }")
    div(
      class="w-max p-2.5 rounded bg-grey-800"
      :style="{ 'box-shadow': isExpand ? '0px 1.5px 3.6px rgba(38, 38, 38, 0.24), 0px 6px 14.4px rgba(38, 38, 38, 0.24)' : '' }"
    )
      div(class="grid grid-cols-6 grid-rows-1 gap-x-2 gap-y-1.5")
        label(
          v-for="(item, index) in labelColorList"
          :key="item.labelColor"
          class="w-5 h-5 relative rounded-sm cursor-pointer"
          :class="{ 'border border-grey-600': index < 2 }"
          :style="{ backgroundColor: item.labelColor }"
          @click="innerLabelColor = item.labelColor"
        )
          f-svg-icon(
            v-if="item.labelColor === innerLabelColor"
            iconName="done"
            size="14"
            class="absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            :class="[item.invertContent ? 'text-primary-inverse' : 'text-primary']"
          )
</template>

<script setup>
import { useConstants } from '@/utils/constants'
import { computed } from 'vue'

const { CROPPER_GRID_COLORS } = useConstants()

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

const textColor = computed(
  () =>
    CROPPER_GRID_COLORS.find(({ color }) => color === props.labelColor)?.text
)

const innerLabelColor = computed({
  get: () => props.labelColor,
  set: (v) => emit('update:labelColor', v),
})
</script>
