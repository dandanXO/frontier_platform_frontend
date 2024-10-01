<template>
  <button
    type="button"
    :class="[
      'relative inline-flex flex-shrink-0 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer focus:outline-none',
      switchClasses,
    ]"
    :disabled="disabled"
    @click="toggleSwitch"
    role="switch"
    :aria-checked="isOn"
  >
    <span class="sr-only">Toggle switch</span>
    <span
      :class="[
        'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
        circleClasses,
      ]"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  value?: boolean
  disabled?: boolean
  size: 'small' | 'medium'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'medium',
  value: false,
})

const emit = defineEmits(['update:value'])

const isOn = computed({
  get: () => props.value,
  set: (value) => emit('update:value', value),
})

const toggleSwitch = () => {
  if (!props.disabled) {
    isOn.value = !isOn.value
  }
}

const switchClasses = computed(() => ({
  'bg-primary-400': isOn.value && !props.disabled,
  'bg-grey-200': !isOn.value && !props.disabled,
  'bg-grey-400': props.disabled,
  'focus:ring-2 focus:ring-blue-500': !props.disabled,
  'h-4 w-7': props.size === 'small',
  'h-6 w-11': props.size === 'medium',
}))

const circleClasses = computed(() => ({
  'translate-x-5': isOn.value && props.size === 'medium',
  'translate-x-6': isOn.value && props.size === 'small',
  'bg-white': !props.disabled,
  'bg-grey-400': props.disabled,
  'h-3 w-3': props.size === 'small',
  'h-5 w-5': props.size === 'medium',
}))
</script>

<script lang="ts">
export default { name: 'FInputToggle' }
</script>
