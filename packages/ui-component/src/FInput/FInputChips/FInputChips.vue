<template lang="pug">
f-input-container(:label="label" :required="required" ref="refContainer")
  f-popper(
    placement="bottom-start"
    :offset="[0, -popperOffsetY]"
    @expand="expand"
    @collapse="collapse"
    data-cy="input-chips"
  )
    template(#trigger)
      label(
        class="px-4 py-1 border border-grey-200 rounded flex flex-wrap gap-x-2 gap-y-1.5 min-h-11"
      )
        div(v-for="chip in chips" class="flex")
          f-label {{ returnObject ? chip[keyOptionDisplay] : chip }}
        input(
          v-if="chips.length === 0"
          type="text"
          :placeholder="placeholder"
          class="line-clamp-1 h-8 flex-grow outline-none bg-transparent overflow-hidden text-grey-900 text-body2 disabled:text-grey-600 placeholder:text-grey-200 placeholder:overflow-visible"
        )
    template(#content)
      div(:style="{ width: contentWidth + 'px' }")
        label(
          class="px-4 py-1 border border-grey-200 rounded flex flex-wrap gap-x-2 gap-y-1.5 min-h-11"
          :class="[classBorder]"
        )
          div(v-for="(chip, index) in chips" class="flex")
            f-label {{ returnObject ? chip[keyOptionDisplay] : chip }}
              f-svg-icon(
                iconName="clear"
                size="20"
                class="text-grey-200 cursor-pointer ml-1"
                @click.stop="removeChip(index)"
              )
          input(
            ref="refInput"
            type="text"
            v-model="inputValue"
            @focus="onFocus"
            @keydown="onKeydown($event)"
            :placeholder="chips.length === 0 ? placeholder : ''"
            class="line-clamp-1 h-8 flex-grow outline-none bg-transparent overflow-hidden text-grey-900 text-body2 disabled:text-grey-600 placeholder:text-grey-200 placeholder:overflow-visible"
          )
        f-list(v-if="optionList.length !== 0")
          f-scrollbar-container(v-if="filteredOptionList.length > 0" class="max-h-72")
            f-list-item(
              v-for="option in filteredOptionList"
              class="cursor-pointer"
              :class="[{ 'bg-grey-100': option.checked }]"
              @click="option.checked ? removeChipFromOptionList(option) : addChipFromOptionList(option)"
              data-cy="list-item"
            )
              p(class="text-grey-600") {{ option.displayValue }}
          f-list-item(v-else @click.stop="addChip" data-cy="list-item")
            p(class="text-grey-900") {{ inputValue }}
</template>

<script>
export default {
  name: 'FInputChips',
}
</script>

<script setup>
import useInput from '../useInput'
import { ref, computed, nextTick, useSlots, onMounted } from 'vue'

const emit = defineEmits(['update:chips', 'blur', 'addNewOption'])
const props = defineProps({
  /**
   * inherit from `FInputContainer.vue`
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * inherit from `FInputContainer.vue`
   *
   * only work when `label` has been setted
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * v-model:chips
   *
   * format: same as optionList
   */
  chips: {
    type: Array,
    required: true,
  },
  /**
   * ```
   * [
   *   {
   *     [keyOptionDisplay]: String,
   *     ...
   *   }
   * ]
   * ```
   * or
   *
   * ```
   * [ String ]
   * ```
   */
  optionList: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  keyOptionDisplay: {
    type: String,
    default: 'name',
  },
  /**
   *  When `canAddNewOption` is true, the `addNewOption` event must also be handled
   */
  canAddNewOption: {
    type: Boolean,
    default: (v) => !(typeof v.optionList[0] === 'object'),
  },
})

const refInput = ref(null)
const inputValue = ref('')
const { onFocus, onBlur, classBorder } = useInput({
  context: { emit, slots: useSlots() },
})
const returnObject = computed(() => typeof props.optionList[0] === 'object')

const refContainer = ref(null)
const contentWidth = ref(0)

const popperOffsetY = ref(44)

const setPopperOffsetY = () => {
  if (props.label) {
    popperOffsetY.value =
      refContainer.value.$el.children[1].getBoundingClientRect().height
  } else {
    popperOffsetY.value =
      refContainer.value.$el.children[0].getBoundingClientRect().height
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
  const list = []
  props.optionList.forEach((option) => {
    const comparedValue = returnObject.value
      ? option[props.keyOptionDisplay]
      : option

    if (
      comparedValue
        .toUpperCase()
        .includes(inputValue.value.trim().toUpperCase())
    ) {
      const checked = props.chips.some(
        (chip) => JSON.stringify(chip) === JSON.stringify(option)
      )
      list.push({
        checked,
        displayValue: comparedValue,
      })
    }
  })
  return list
})

const addChip = async () => {
  if (inputValue.value.trim().length === 0) {
    return
  }
  /**
   * if the chip to be added doesn't exist in option list,
   * emit "addNewOption" to outside to add an new option in option list
   */
  const isOptionExist = props.optionList.some((option) => {
    return returnObject.value
      ? option[props.keyOptionDisplay] === inputValue.value
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
  const isChipExist = props.chips.find((chip) => {
    return returnObject.value
      ? chip[props.keyOptionDisplay] === inputValue.value
      : chip === inputValue.value
  })

  if (!isChipExist) {
    const newChip = returnObject.value
      ? props.optionList.find(
          (option) => option[props.keyOptionDisplay] === inputValue.value
        )
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

const addChipFromOptionList = (option) => {
  inputValue.value = option.displayValue
  addChip()
}

const removeChipFromOptionList = (option) => {
  const index = props.chips.findIndex((chip) => {
    return returnObject.value
      ? chip[props.keyOptionDisplay] === option.displayValue
      : chip === option.displayValue
  })
  removeChip(index)
}

onMounted(() => {
  setPopperOffsetY()
})
</script>
