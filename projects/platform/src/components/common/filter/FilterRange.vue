<template lang="pug">
div(class="px-5")
  div(class="flex justify-between pb-5")
    div(class="flex items-center gap-x-2")
      p(class="text-body2 text-grey-900 font-bold") {{ label }}
      f-button-label(size="sm" @click="reset") {{ $t('UU0040') }}
    div
      slot(name="right")
  f-input-range(
    ref="refInputRange"
    v-model:range="innerRange"
    v-bind="options"
  )
  div(class="grid grid-cols-2 gap-4 mt-4")
    div
      div(class="text-caption text-grey-600 pb-2") {{ $t("JJ0006") }}
      div(class="h-13")
        f-input-text(v-model:textValue="formattedMinValue" size="sm" @change="handleMinValueChange")
          template(v-if="isFromError" #slot:errorMsg)
            i18n-t(keypath="JJ0007" tag="p" class="text-caption text-red-400 pt-1" scope="global")
              template(#JJ0005) 
                span(class="font-bold") {{ $t("JJ0005") }}
    div
      div(class="text-caption text-grey-600 pb-2") {{ $t("JJ0005") }}
      div(class="h-13")
        f-input-text(v-model:textValue="formattedMaxValue" size="sm" @change="handleMaxValueChange")
          template(v-if="isToError" #slot:errorMsg)
            i18n-t(keypath="JJ0008" tag="p" class="text-caption text-red-400 pt-1" scope="global")
              template(#JJ0006) 
                span(class="font-bold") {{ $t("JJ0006") }}
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'

export default {
  name: 'FilterRange',
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 200
    },
    range: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: ''
    }
  },
  emits: ['update:range'],
  setup (props, { emit }) {
    const { t } = useI18n()
    const isFromError = ref(false)
    const isToError = ref(false)

    const fakeMaxValue = props.max + 1
    const refInputRange = ref(null)
    const innerRange = computed({
      get: () => {
        const inputMin = props.range[0] === null ? props.min : props.range[0]
        const inputMax = props.range[1] === null ? fakeMaxValue : props.range[1]
        return [inputMin, inputMax]
      },
      set: ([min, max]) => {
        isToError.value = false
        isFromError.value = false
        if (props.min === Number(min) && props.max === Number(max) - 1) {
          emit('update:range', [null, null])
        } else {
          emit('update:range', [Number(min), Number(max)])
        }
      }
    })

    const formattedMinValue = computed({
      get: () => {
        const inputMin = props.range[0] === null ? props.min : props.range[0]
        return customFormatter(inputMin)
      },
      set: (v) => {
        innerRange.value = [v, innerRange.value[1]]
      }
    })

    const formattedMaxValue = computed({
      get: () => {
        const inputMax = props.range[1] === null ? fakeMaxValue : props.range[1]
        return customFormatter(inputMax)
      },
      set: (v) => {
        innerRange.value = [innerRange.value[0], v]
      }
    })

    const handleMinValueChange = (e) => {
      const value = Number(e.target.value)
      if (value <= innerRange.value[1]) {
        refInputRange.value.setValue([value, innerRange.value[1]])
      } else {
        isFromError.value = true
      }
    }

    const handleMaxValueChange = (e) => {
      const value = Number(e.target.value)
      if (value >= innerRange.value[0]) {
        refInputRange.value.setValue([innerRange.value[0], value])
      } else {
        isToError.value = true
      }
    }

    const customFormatter = (v) => {
      if (v <= props.max) {
        return Number.parseFloat(v).toFixed(0)
      } else {
        // e.g. When max is 200, 201 -> 200+
        return `${props.max}+`
      }
    }

    const options = {
      tooltips: [
        {
          from: (v) => v,
          to: (v) => customFormatter(v)
        }, {
          from: (v) => v,
          to: (v) => customFormatter(v)
        }
      ],
      min: props.min,
      max: fakeMaxValue
    }

    const reset = () => {
      refInputRange.value.setValue([props.min, fakeMaxValue])
    }

    return {
      innerRange,
      formattedMinValue,
      formattedMaxValue,
      handleMinValueChange,
      handleMaxValueChange,
      refInputRange,
      reset,
      options,
      fakeMaxValue,
      isFromError,
      isToError
    }
  }
}
</script>
