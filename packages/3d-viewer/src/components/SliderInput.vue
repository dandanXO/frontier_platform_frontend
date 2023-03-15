<template lang="pug">
div(ref="rootDom" class="flex flex-col w-full justify-between py-1")
  div(class="flex flex-row items-center gap-x-2")
    p(class="text-body2 font-bold") {{ name }}
    f-button-label(
      theme="dark"
      size="sm"
      :disabled="!changed"
      @click="emit('reset')"
    ) {{ $t('EE0138') }}
  div(class="flex flex-row items-center justify-between")
    div(class="w-50 flex flex-row items-center")
      input(
        ref="sliderInputDom"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        @input="handleSliderInput"
      )
    f-input-number(
      class="w-16 text-grey-100 bg-grey-900 border:none"
      theme="dark"
      type="number"
      :value="props.range"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      @change="handleNumberChange"
    )
</template>

<script setup lang="ts">
import { clamp } from 'ramda'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  name: string
  range: number
  changed: boolean
  min: number
  max: number
  step: number
  useLog?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:range', v: number): void
  (e: 'reset'): void
}>()

const rootDom = ref<HTMLElement>()
const sliderInputDom = ref<HTMLInputElement>()

const min = computed(() => {
  if (props.useLog) return Math.log10(props.min)
  return props.min
})

const max = computed(() => {
  if (props.useLog) return Math.log10(props.max)
  return props.max
})

const step = computed(() => {
  if (props.useLog) return props.step ** 10
  return props.step
})

const value = computed(() => {
  if (props.useLog) return Math.log10(props.range)
  return props.range
})

const handleKeyboardEvent = (e: KeyboardEvent) => e.stopPropagation()

watch(value, (v) => {
  const target = sliderInputDom.value
  if (!target) return

  const backgroundSize =
    ((v - min.value) * 100) / (max.value - min.value) + '% 100%'
  target.style.backgroundSize = backgroundSize
})

onMounted(() => {
  const target = sliderInputDom.value
  if (!target) return

  const backgroundSize =
    ((value.value - min.value) * 100) / (max.value - min.value) + '% 100%'
  target.style.backgroundSize = backgroundSize
})

const handleSliderInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = Number(target.value)
  const result = Number((props.useLog ? 10 ** value : value).toFixed(2))

  emit('update:range', result)
}

const handleNumberChange = (v: number) => {
  emit('update:range', clamp(props.min, props.max, v))
}

onMounted(() => {
  if (!rootDom.value) return
  rootDom.value.addEventListener('keydown', handleKeyboardEvent)
})

onUnmounted(() => {
  if (!rootDom.value) return
  rootDom.value.removeEventListener('keydown', handleKeyboardEvent)
})
</script>

<style scoped>
input[type='range'] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 5px;
  background: #676767;
  background-image: linear-gradient(#20a17a, #20a17a);
  background-size: 70% 100%;
  background-repeat: no-repeat;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  border: 1px solid #676767;
  background: #262626;
  cursor: ew-resize;
}

input[type='range']::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}
</style>
