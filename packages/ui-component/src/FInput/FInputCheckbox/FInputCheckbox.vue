<template lang="pug">
label(class="flex items-center" :class="{ 'cursor-pointer': !disabled }")
  f-svg-icon(
    v-if="checked"
    iconName="check_box"
    :size="iconSize"
    :class="[disabled ? 'text-grey-250' : iconColor]"
  )
  f-svg-icon(
    v-else
    iconName="check_box_outline_blank"
    :size="iconSize"
    :class="[uncheckColor]"
  )
  input(
    type="checkbox"
    class="hidden"
    :checked="checked"
    :value="value"
    @input="check($event)"
    :disabled="disabled"
  )
  div(class="flex flex-row gap-x-2 items-center px-2")
    slot
    div(
      v-if="label !== ''"
      class="text-body2 whitespace-nowrap"
      :class="[disabled ? 'text-grey-250' : 'text-grey-900']"
    ) {{ label }}
</template>

<script lang="ts">
export default { name: 'FInputCheckbox' }
</script>

<script setup lang="ts">
import { computed } from 'vue'

type ArrayInputValue = Array<any>
type InputValue = boolean | ArrayInputValue

const props = withDefaults(
  defineProps<{
    /**
     * when `binary` is true, the type of `inputValue` must be Boolean
     */
    binary?: boolean
    /**
     * v-model:inputValue
     */
    inputValue: InputValue
    /**
     * The value used when the component is selected
     *
     * you don't have to set value if `binary` is true
     */
    value?: any
    label?: string | number
    iconSize?: string
    iconColor?: string
    uncheckColor?: string
    disabled: boolean
  }>(),
  {
    binary: false,
    label: '',
    iconSize: '24',
    iconColor: 'text-primary-400',
    uncheckColor: 'text-grey-250',
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'update:inputValue', v: InputValue): void
}>()

const checked = computed(() => {
  if (props.binary) {
    return props.inputValue
  } else {
    const arrayInputValue = props.inputValue as ArrayInputValue
    const tempInputValueString = arrayInputValue.map((v) => JSON.stringify(v))
    return tempInputValueString.includes(JSON.stringify(props.value))
  }
})

const check = (e: Event) => {
  if (!e.target) {
    return
  }

  const target = e.target as HTMLInputElement
  if (props.binary) {
    emit('update:inputValue', !props.inputValue)
    return
  }
  const arrayInputValue = props.inputValue as ArrayInputValue
  const updatedInputValue = [...arrayInputValue]
  if (!target.checked) {
    const tempInputValueString = arrayInputValue.map((v) => JSON.stringify(v))
    updatedInputValue.splice(
      tempInputValueString.indexOf(JSON.stringify(props.value)),
      1
    )
  } else {
    updatedInputValue.push(props.value)
  }
  emit('update:inputValue', updatedInputValue)
}
</script>
