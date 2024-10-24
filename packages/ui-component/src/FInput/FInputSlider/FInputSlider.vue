<style lang="scss">
.noUi-target {
  @apply relative border-none shadow-none bg-grey-150;
}

.noUi-connect {
  @apply bg-primary-400;
}

// handle base css
.noUi-handle {
  background-color: var(--noUi-handle-bg-color);
  border: 1px solid var(--noUi-horizontal-color);
  @apply rounded-full shadow-none;

  &:active {
    background-color: var(--noUi-handle-bg-active-color);
  }
}

.noUi-touch-area {
  background-color: var(--noUi-handle-bg-color);
  @apply rounded-full;
}

// horizontal type
.noUi-horizontal {
  background-color: var(--noUi-horizontal-color);
  @apply h-1;

  .noUi-handle {
    width: 18px;
    height: 18px;
    top: -8px;
    right: -9px;
  }

  .noUi-tooltip {
    @apply bottom-6;
  }
}

// vertical type
.noUi-vertical {
  @apply w-1;

  .noUi-handle {
    width: 18px;
    height: 18px;
    right: -7px;
    bottom: -9px;
  }

  .noUi-tooltip {
    @apply -right-full transform translate-x-full -translate-y-1/2;
  }
}

// tooltip
.noUi-handle {
  &:hover,
  &:active {
    .noUi-tooltip {
      @apply block;
    }
  }

  .noUi-tooltip {
    @apply hidden h-7 border-none rounded px-2 py-1.5 text-grey-50 bg-grey-900/80 font-normal text-caption/1.3;
  }
}

.noUi-handle::before,
.noUi-handle::after {
  @apply hidden;
}

.noUi-vertical .noUi-origin {
  @apply bottom-0;
}

// disabled status
[disabled] {
  .noUi-connect {
    @apply bg-grey-300;
  }

  .noUi-handle {
    @apply bg-grey-150;

    &:active {
      @apply bg-grey-150;
    }
  }
}
</style>

<template lang="pug">
div(class="flex flex-col" :class="{ 'items-center': orientation === 'vertical' }")
  div(
    v-if="!!labelIcon || !!label || canReset"
    :class="theme === THEME.LIGHT ? 'text-grey-900' : 'text-grey-100'"
  )
    template(v-if="orientation === 'horizontal'")
      div(class="flex items-center")
        f-svg-icon(v-if="!!labelIcon" :iconName="labelIcon" size="20" class="mr-1")
        p(v-if="!!label" class="text-body2 font-bold mr-2") {{ label }}
        f-button-label(
          v-if="canReset"
          :theme="theme"
          size="sm"
          :disabled="!isDirty"
          @click="reset"
        ) {{ $t('RR0255') }}
    template(v-else)
      div(class="flex items-center")
        p(v-if="!!label" class="text-body2 font-bold mr-2") {{ label }}
        f-svg-icon(v-if="!!labelIcon" :iconName="labelIcon" size="20")
      f-button-label(
        v-if="canReset"
        :theme="theme"
        size="sm"
        :disabled="!isDirty"
        @click="reset"
        class="mx-auto my-3"
      ) {{ $t('RR0255') }}
  div(
    class="relative flex items-center justify-center"
    :class="[orientation === 'horizontal' ? 'flex-row gap-x-4 h-9' : 'flex-col gap-y-4 w-9 flex-grow']"
    :style="cssProps"
  )
    div(
      ref="refSlider"
      :class="[orientation === 'horizontal' ? 'w-full' : 'h-full']"
    )
      template(v-if="orientation === 'horizontal' && isDragging") 
        div(
          class="absolute -bottom-3 w-1 h-1 bg-grey-300 rounded-full"
          :style="{ left: `calc(${defaultIndicatorPosition[0]}% - 2px)` }"
        )
        div(
          v-show="defaultRange.length > 1"
          class="absolute -bottom-3 w-1 h-1 -mx-[9px] bg-grey-300 rounded-full"
          :style="{ left: `calc(${defaultIndicatorPosition[1]}% + 7px)` }"
        )
      template(v-if="orientation === 'vertical' && isDragging")
        div(
          class="absolute -right-3 w-1 h-1 -my-[9px] bg-grey-300 rounded-full"
          :style="{ bottom: `calc(${defaultIndicatorPosition[0]}% + 5px)` }"
        )
        div(
          v-show="defaultRange.length > 1"
          class="absolute -right-3 w-1 h-1 -my-[9px] bg-grey-300 rounded-full"
          :style="{ bottom: `calc(${defaultIndicatorPosition[1]}% + 7px)` }"
        )
    f-input-text(
      v-if="isOneHandle && withInput"
      v-model:textValue="inputValue"
      inputType="number"
      :size="SIZE.MD"
      :addOnRight="inputUnit"
      :class="[inputWidth, 'flex-shrink-0']"
      :clearable="false"
      :disabled="disabled"
      :min="inputMin"
      :max="inputMax"
      :step="inputStep"
      :theme="theme"
    )
</template>

<script>
export default {
  name: 'FInputSlider',
}
</script>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import noUiSlider from 'nouislider'
import 'nouislider/dist/nouislider.css'
import colors from '@frontier/tailwindcss/colors'
// https://refreshless.com/nouislider/
import { SIZE, THEME } from '../../constants'

const emit = defineEmits(['update:range'])
const props = defineProps({
  theme: {
    type: String,
    default: THEME.LIGHT,
  },
  /**
   * Number -> One Way
   *
   * Array -> Two Way
   */
  range: {
    type: [Number, Array],
    required: true,
  },
  canReset: {
    type: Boolean,
    default: true,
  },
  defaultRange: {
    type: [Number, Array],
    required: true,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 200,
  },
  step: {
    type: Number,
    default: 1,
  },
  /**
   * set `false`, `true` or `formatter` to apply to the each handle.
   * or pass an array to set individually.
   * `array[formatter or true or false, ...]`
   */
  tooltips: {
    type: [Boolean, Array],
    default: false,
  },
  orientation: {
    type: String,
    validator: (v) => ['horizontal', 'vertical'].includes(v),
    default: 'horizontal',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  withInput: {
    type: Boolean,
    default: false,
  },
  inputUnit: {
    type: String,
    default: '',
  },
  inputWidth: {
    type: String, // TailwindCSS
    default: 'w-30',
  },
  label: {
    type: String,
    default: '',
  },
  labelIcon: {
    type: String,
    default: '',
  },
  /**
   * can only use in one way handle
   */
  useLog: {
    type: Boolean,
    default: false,
  },
})

const range = computed(() => {
  if (props.useLog) {
    return Math.log10(props.range)
  }
  return props.range
})

const rangeMin = computed(() =>
  props.useLog ? Math.log10(props.min) : props.min
)
const rangeMax = computed(() =>
  props.useLog ? Math.log10(props.max) : props.max
)
const rangeStep = computed(() => (props.useLog ? props.step ** 10 : props.step))
const rangeValue = computed(() =>
  props.useLog ? Math.log10(props.range) : props.range
)
const inputMin = computed(() => props.min)
const inputMax = computed(() => props.max)
const inputStep = computed(() => props.step)
const inputValue = computed({
  get: () => props.range,
  set: (v) => setValue(v),
})

const refSlider = ref(null)
const isOneHandle = computed(() => !Array.isArray(range.value))
const isDragging = ref(false)

const isDirty = computed(() => {
  if (isOneHandle.value) {
    return props.defaultRange !== inputValue.value
  } else {
    const [defaultMin, defaultMax] = props.defaultRange
    const [currentMin, currentMax] = range.value
    return !(defaultMin === currentMin && defaultMax === currentMax)
  }
})

const setValue = (v) => {
  refSlider.value.noUiSlider.set(props.useLog ? Math.log10(v) : v)
}

const reset = () => {
  setValue(props.defaultRange)
}

defineExpose({
  setValue,
  reset,
})

onMounted(() => {
  noUiSlider.create(refSlider.value, {
    connect: typeof range.value === 'number' ? 'lower' : true,
    tooltips: props.tooltips,
    step: rangeStep.value,
    orientation: props.orientation,
    direction: props.orientation === 'vertical' ? 'rtl' : 'ltr',
    start: rangeValue.value,
    range: {
      min: rangeMin.value,
      max: rangeMax.value,
    },
  })

  refSlider.value.noUiSlider.on('start', () => {
    isDragging.value = true
  })

  refSlider.value.noUiSlider.on('update', () => {
    let values = refSlider.value.noUiSlider.get(true)
    if (Array.isArray(values)) {
      values = values.map((v) =>
        Number((props.useLog ? 10 ** Number(v) : Number(v)).toFixed(2))
      )
    } else {
      values = Number(
        (props.useLog ? 10 ** Number(values) : Number(values)).toFixed(2)
      )
    }

    emit('update:range', values)
  })

  refSlider.value.noUiSlider.on('end', () => {
    isDragging.value = false
  })

  props.disabled
    ? refSlider.value.noUiSlider.disable()
    : refSlider.value.noUiSlider.enable()
})

watch(
  () => props.disabled,
  () => {
    props.disabled
      ? refSlider.value.noUiSlider.disable()
      : refSlider.value.noUiSlider.enable()
  }
)

const cssProps = computed(() => {
  if (props.theme === THEME.LIGHT) {
    return {
      '--noUi-handle-bg-color': colors.grey[0],
      '--noUi-handle-bg-active-color': colors.grey[100].DEFAULT,
      '--noUi-horizontal-color': colors.grey[150],
    }
  } else {
    return {
      '--noUi-handle-bg-color': colors.grey[900].DEFAULT,
      '--noUi-handle-bg-active-color': colors.grey[800].DEFAULT,
      '--noUi-horizontal-color': colors.grey[750],
    }
  }
})

const defaultIndicatorPosition = computed(() => {
  const getPercentage = (v) =>
    parseFloat((v - rangeMin.value) / (rangeMax.value - rangeMin.value)) * 100

  if (isOneHandle.value) {
    return [getPercentage(props.defaultRange)]
  }
  return [
    getPercentage(props.defaultRange[0]),
    getPercentage(props.defaultRange[1]),
  ]
})
</script>
