<template lang="pug">
div(class="relative")
  div(class="flex items-center pb-3")
    p(class="text-body2 font-bold pr-1.5") {{ label }}
    f-button-label(size="sm" @click="reset") {{ $t('UU0040') }}
  f-input-slider(
    ref="refInputSlider"
    v-model:range="innerRange"
    v-bind="options"
    :canReset="false"
  )
  div(class="grid grid-cols-2 gap-4 pt-3")
    div
      p(class="text-caption text-grey-600 pb-2") {{ $t('JJ0006') }}
      f-input-text(
        v-model:textValue="formattedMinValue"
        size="md"
        @change="handleMinValueChange"
      )
        template(#slot:hint-error v-if="isFromError")
          i18n-t(
            keypath="JJ0007"
            tag="p"
            class="text-caption text-red-400 pt-1"
            scope="global"
          )
            template(#JJ0005) 
              span(class="font-bold") {{ $t('JJ0005') }}
    div
      p(class="text-caption text-grey-600 pb-2") {{ $t('JJ0005') }}
      f-input-text(
        v-model:textValue="formattedMaxValue"
        size="md"
        @change="handleMaxValueChange"
      )
        template(#slot:hint-error v-if="isToError")
          i18n-t(
            keypath="JJ0008"
            tag="p"
            class="text-caption text-red-400 pt-1"
            scope="global"
          )
            template(#JJ0006) 
              span(class="font-bold") {{ $t('JJ0006') }}
</template>

<script setup lang="ts">
import type { FInputSlider } from '@frontier/ui-component'
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'update:range', v: Array<number>): void
  (e: 'reset'): void
}>()

const props = withDefaults(
  defineProps<{
    min: number
    max: number
    range: Array<number>
    label?: string
  }>(),
  {
    min: 0,
    max: 200,
  }
)
const isFromError = ref(false)
const isToError = ref(false)

const fakeMaxValue = props.max + 1
const refInputSlider = ref<InstanceType<typeof FInputSlider>>()
const innerRange = computed({
  get: () => props.range,
  set: ([min, max]) => {
    isToError.value = false
    isFromError.value = false
    emit('update:range', [Number(min), Number(max)])
  },
})

const formattedMinValue = computed({
  get: () => customFormatter(props.range[0]),
  set: (v: string) => {
    innerRange.value = [Number(v), innerRange.value[1]]
  },
})

const formattedMaxValue = computed({
  get: () => customFormatter(props.range[1]),
  set: (v: string) => {
    innerRange.value = [innerRange.value[0], Number(v)]
  },
})

const handleMinValueChange = (e: Event) => {
  if (!e.target) {
    return
  }
  const target = e.target as HTMLInputElement
  const value = Number(target.value)
  if (value <= innerRange.value[1]) {
    refInputSlider.value!.setValue([value, innerRange.value[1]])
  } else {
    isFromError.value = true
  }
}

const handleMaxValueChange = (e: Event) => {
  if (!e.target) {
    return
  }
  const target = e.target as HTMLInputElement
  const value = Number(target.value)
  if (value >= innerRange.value[0]) {
    refInputSlider.value!.setValue([innerRange.value[0], value])
  } else {
    isToError.value = true
  }
}

const customFormatter = (v: number) => {
  if (v <= props.max) {
    return String(Math.round(v))
  } else {
    // e.g. When max is 200, 201 -> 200+
    return `${props.max}+`
  }
}

const options = {
  tooltips: [
    {
      from: (v: number) => v,
      to: (v: number) => customFormatter(v),
    },
    {
      from: (v: number) => v,
      to: (v: number) => customFormatter(v),
    },
  ],
  min: props.min,
  max: fakeMaxValue,
  defaultRange: [props.min, fakeMaxValue],
}

const reset = () => {
  refInputSlider.value && refInputSlider.value.reset()
  emit('reset')
}
</script>
