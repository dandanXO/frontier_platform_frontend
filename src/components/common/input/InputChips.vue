<template lang="pug">
input-container(:label="label" :required="required" v-click-away="onBlur")
  label(class="relative px-4 py-1.5 border rounded flex flex-wrap gap-x-2 gap-y-1.5 min-h-11" :class="[classBorder]")
    div(v-for="(chip, index) in chips" class="flex")
      div(class="px-3 h-8 flex items-center gap-x-1 bg-primary-thin rounded")
        p(class="text-body2 text-primary") {{returnObject ? chip[keyOptionDisplay]: chip}}
        svg-icon(iconName="clear" size="20" class="text-black-500 cursor-pointer" @click="removeChip(index)")
    input(
      ref="inputElement"
      type="text"
      v-model="inputValue"
      @focus="onFocus"
      @keydown="onKeydown($event)"
      :placeholder="chips.length === 0 ? placeholder :''"
      class="h-8 flex-grow outline-none bg-transparent overflow-hidden text-primary text-body2 placeholder-black-400 placeholder-text-body2 placeholder-overflow-visible disabled:text-black-600"
    )
    list(v-if="options.length !== 0 && isFocus" class="absolute z-10 top-full left-0 w-full transform translate-y-2 bg-black-0")
      overlay-scrollbar-container(v-if="filteredOptions.length > 0" class="max-h-72")
        list-item(
          v-for="option in filteredOptions"
          class="cursor-pointer"
          :class="[{ 'bg-black-200': option.checked }]"
          @click="option.checked ? removeChipFromOptions(option) : addChipFromOptions(option)"
        )
          p(class="text-black-600") {{returnObject ? option[keyOptionDisplay]: option.name}}
      list-item(v-else @click.stop="addChip")
        p(class="text-primary") {{inputValue}}
</template>

<script>
import useInput from '@/composables/useInput'
import { directive } from 'vue3-click-away'
import { ref, computed, nextTick } from 'vue'

export default {
  name: 'InputChips',
  directives: {
    ClickAway: directive
  },
  props: {
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    chips: {
      type: Array,
      required: true
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    keyOptionDisplay: {
      type: String,
      default: 'name'
    },
    keyOptionValue: {
      type: String,
      default: 'id'
    }
  },
  emits: ['update:chips', 'blur', 'addNewOption'],
  setup (props, context) {
    const inputElement = ref(null)
    const inputValue = ref('')
    const { isFocus, onFocus, onBlur, classBorder } = useInput({ context })
    const returnObject = computed(() => typeof props.options[0] === 'object')

    const filteredOptions = computed(() => {
      inputValue.value.trim()
      return props.options
        .filter(option => {
          if (inputValue.value.trim().length === 0) {
            return true
          }
          const comparedValue = returnObject.value ? option[props.keyOptionValue] : option
          return comparedValue.includes(inputValue.value)
        })
        .map(option => {
          const checked = props.chips.some(chip => {
            return returnObject.value
              ? chip[props.keyOptionValue] === option[props.keyOptionValue]
              : chip === option
          })
          return returnObject.value
            ? {
              ...option,
              checked
            }
            : {
              name: option,
              checked
            }
        })
    })

    const addChip = async () => {
      inputValue.value = inputValue.value.trim()

      if (inputValue.value.length === 0) {
        return
      }
      /**
       * if the chip to be added doesn't exist in option list,
       * emit "addNewOption" to outside to add an new option in option list
       */
      const isOptionExist = props.options.some(option => {
        return returnObject.value
          ? option[props.keyOptionValue] === inputValue.value
          : option === inputValue.value
      })
      if (!isOptionExist) {
        context.emit('addNewOption', inputValue.value)
        await nextTick()
      }

      /**
       *  if the chip to be added doesn't exist in chip list,
       *  emit "update:chips" to outside to append an new chip,
       *  in the other way, do nothing just clear input text
       */
      const isChipExist = props.chips.some(chip => {
        return returnObject.value
          ? chip[props.keyOptionValue] === inputValue.value
          : chip === inputValue.value
      })
      if (!isChipExist) {
        const newChip = returnObject.value
          ? props.options.find(option => option[props.keyOptionValue] === inputValue.value)
          : inputValue.value
        context.emit('update:chips', [...props.chips, newChip])
      }

      inputValue.value = ''
      inputElement.value.focus()
    }

    const removeChip = (index) => {
      const temp = [...props.chips]
      temp.splice(index, 1)
      context.emit('update:chips', temp)
    }

    const onKeydown = (e) => {
      switch (e.which) {
        case 13: // enter
          addChip()
          break
        case 8: // backspace
          inputValue.value.length === 0 && removeChip(props.chips.length - 1)
          break
      }
    }

    const addChipFromOptions = (option) => {
      inputValue.value = returnObject.value ? option[props.keyOptionValue] : option.name
      addChip()
    }

    const removeChipFromOptions = (option) => {
      const index = props.chips.findIndex(chip => {
        return returnObject.value
          ? chip[props.keyOptionValue] === option[props.keyOptionValue]
          : chip === option.name
      })
      removeChip(index)
    }

    return {
      inputElement,
      onFocus,
      onBlur,
      classBorder,
      onKeydown,
      removeChip,
      isFocus,
      inputValue,
      filteredOptions,
      addChipFromOptions,
      removeChipFromOptions,
      addChip,
      returnObject
    }
  }
}
</script>
