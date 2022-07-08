<template lang="pug">
input-container(:label="label" :required="required" ref="refContainer")
  popper(placement="bottom-start" :offset="[0, -popperOffsetY]" @expand="expand" @collapse="collapse")
    template(#trigger)
      label(class="px-4 py-1.5 border rounded flex flex-wrap gap-x-2 gap-y-1.5 min-h-11")
        div(v-for="chip in chips" class="flex")
          tag {{ returnObject ? chip[keyOptionDisplay] : chip }}
        input(
          v-if="chips.length === 0"
          type="text"
          :placeholder="placeholder"
          class="line-clamp-1 h-8 flex-grow outline-none bg-transparent overflow-hidden text-primary text-body2 disabled:text-black-600 placeholder:text-black-400 placeholder:overflow-visible"
        )
    template(#content)
      div(:style="{ width: contentWidth + 'px' }")
        label(class="px-4 py-1.5 border rounded flex flex-wrap gap-x-2 gap-y-1.5 min-h-11" :class="[classBorder]")
          div(v-for="(chip, index) in chips" class="flex")
            tag {{ returnObject ? chip[keyOptionDisplay] : chip }}
              svg-icon(iconName="clear" size="20" class="text-black-500 cursor-pointer ml-1" @click.stop="removeChip(index)")
          input(
            ref="refInput"
            type="text"
            v-model="inputValue"
            @focus="onFocus"
            @keydown="onKeydown($event)"
            :placeholder="chips.length === 0 ? placeholder : ''"
            class="line-clamp-1 h-8 flex-grow outline-none bg-transparent overflow-hidden text-primary text-body2 disabled:text-black-600 placeholder:text-black-400 placeholder:overflow-visible"
          )
        list(v-if="options.length !== 0")
          overlay-scrollbar-container(v-if="filteredOptionList.length > 0" class="max-h-72")
            list-item(
              v-for="option in filteredOptionList"
              class="cursor-pointer"
              :class="[{ 'bg-black-200': option.checked }]"
              @click="option.checked ? removeChipFromOptions(option) : addChipFromOptions(option)"
            )
              p(class="text-black-600") {{ returnObject ? option[keyOptionDisplay] : option.name }}
          list-item(v-else @click.stop="addChip")
            p(class="text-primary") {{ inputValue }}
</template>

<script>
export default {
  name: 'InputChips'
}
</script>

<script setup>
import useInput from '@/composables/useInput'
import { ref, computed, nextTick, useSlots, onMounted } from 'vue'

const emit = defineEmits(['update:chips', 'blur', 'addNewOption'])
const props = defineProps({
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
  },
  canAddNewOption: {
    type: Boolean,
    default: true
  }
})

const refInput = ref(null)
const inputValue = ref('')
const { onFocus, onBlur, classBorder } = useInput({ context: { emit, slots: useSlots() } })
const returnObject = computed(() => typeof props.options[0] === 'object')

const refContainer = ref(null)
const contentWidth = ref(0)

const popperOffsetY = ref(46)

const setPopperOffsetY = () => {
  if (props.label) {
    popperOffsetY.value = refContainer.value.$el.children[1].getBoundingClientRect().height
  } else {
    popperOffsetY.value = refContainer.value.$el.children[0].getBoundingClientRect().height
  }
}

const expand = () => {
  contentWidth.value = refContainer.value.$el.getBoundingClientRect().width
  setPopperOffsetY()
  refInput.value.focus()
}

const collapse = () => {
  onBlur()
  setPopperOffsetY()
}

const filteredOptionList = computed(() => {
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
  if (inputValue.value.trim().length === 0) {
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
  if (!isOptionExist && props.canAddNewOption) {
    emit('addNewOption', inputValue.value)
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
    if ((!isOptionExist && props.canAddNewOption) || isOptionExist) {
      emit('update:chips', [...props.chips, newChip])
    }
  }

  inputValue.value = ''
  refInput.value.focus()
}

const removeChip = (index) => {
  const temp = [...props.chips]
  temp.splice(index, 1)
  emit('update:chips', temp)
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

onMounted(() => {
  setPopperOffsetY()
})
</script>
