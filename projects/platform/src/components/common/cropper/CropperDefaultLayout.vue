<template lang="pug">
div(class="flex flex-col gap-4 px-10")
  div(class="w-full flex justify-center items-center overflow-hidden")
    div(
      class="relative w-full aspect-square flex justify-center items-center"
      :class="theme === THEME.LIGHT ? 'bg-[#F1F2F5]' : 'bg-grey-900'"
    )
      slot(
        name="imageCropArea"
        :innerScaleSize="scaleValue"
        :innerShowScale="showScale"
      )
  div(class="flex flex-col gap-4" v-if="showScale")
    div(class="flex flex-row gap-2 p-2 !pb-0")
      p(class="text-sm font-bold") {{ $t('EE0098') }}
      f-button(
        type="secondary"
        :disabled="scaleValue <= 100"
        size="xsm"
        @click="resetScale"
        class="min-w-24"
      ) {{ $t('RR0255') }}
    f-input-slider(
      class="px-3"
      ref="refScale"
      v-model:range="formattedScaleValue"
      v-bind="scaleSetting"
      :theme="theme"
      :inputUnit="scaleUnit"
      :canReset="false"
    )
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { THEME } from '@/utils/constants'
import type { CropperConfig } from '@/types'
import type { FInputSlider } from '@frontier/ui-component'

const props = withDefaults(
  defineProps<{
    theme?: string
    showScale?: boolean
    scaleUnit?: string
    scaleInputStep?: number
    scaleRange?: number[]
    scaleStart?: number
    scaleInitial?: number
    config: CropperConfig
  }>(),
  {
    theme: THEME.LIGHT,
    showScale: true,
    scaleUnit: '%',
    scaleInputStep: 1,
    scaleRange: () => {
      return [100, 800]
    },
  }
)

const emit = defineEmits<{
  'update:scaleRatio': [val: number]
  'update:options': [val: CropperConfig]
}>()

const refScale = ref<InstanceType<typeof FInputSlider> | null>(null)
const scaleSetting = {
  step: props.scaleInputStep,
  tooltips: false,
  min: props.scaleRange[0],
  max: props.scaleRange[1],
  defaultRange: props.scaleStart || props.scaleRange[0],
}
const scaleValue = ref(
  props.scaleInitial || props.scaleStart || props.scaleRange[0]
)

const formattedScaleValue = computed({
  get: () => scaleValue.value,
  set: (val) => {
    if (val > props.scaleRange[1] || val < props.scaleRange[0]) {
      return
    }
    scaleValue.value = val
  },
})

const resetScale = () => {
  refScale.value?.reset()
}

defineExpose({ resetScale })

watch(
  () => scaleValue.value,
  () => {
    emit('update:scaleRatio', scaleValue.value)
  },
  {
    immediate: true,
  }
)
</script>
