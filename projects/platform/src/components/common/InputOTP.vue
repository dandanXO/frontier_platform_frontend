<template lang="pug">
div(class="flex flex-col justify-center items-center gap-2 w-full")
  div(class="flex flex-row justify-center items-center gap-3 w-full")
    input(
      v-for="(digit, index) in otpInputs"
      :key="index"
      ref="inputs"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="font-bold min-w-8 min-h-8 text-center border border-grey-200 rounded-[4px] text-sm p-2 focus:shadow-[0px_0px_0px_2px_rgba(138,221,244,1.00)] focus:border-grey-200 outline-none disabled:bg-grey-100"
      :value="digit"
      @input="onInput(index, $event)"
      @keydown.backspace="onBackspace(index, $event)"
      @paste="onPaste($event)"
      @keypress="onKeyPress($event)"
      :disabled="disabled"
    )
  p(class="text-xs text-left self-start" :class="inlineTextClass" v-if="inlineText") {{ inlineText }}
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    otpInputs: string[]
    isOtpValid?: boolean
    otpCode: string
    disabled?: boolean
    inlineText?: string
    inlineTextClass?: string
  }>(),
  {
    isOtpValid: true,
  }
)

const emit = defineEmits([
  'update:isOtpValid',
  'update:otpCode',
  'update:otpInputs',
])
const inputs = ref<HTMLInputElement[]>([])

const onInput = (index: any, event: any) => {
  const value = event.target.value
  const newOtp = [...props.otpInputs]
  newOtp[index] = value

  emit('update:isOtpValid', true)
  emit('update:otpCode', props.otpCode + value)
  emit('update:otpInputs', newOtp)

  if (value.length === 1) {
    if (index < props.otpInputs.length - 1) {
      inputs.value[index + 1].focus()
    } else {
      inputs.value[0].focus()
    }
  }
}
const onBackspace = (index: any, event: any) => {
  emit('update:otpCode', props.otpCode.slice(0, -1))
  if (event.target.value === '' && index > 0) {
    inputs.value[index - 1].focus()
  }
}

const onPaste = (event: any) => {
  const pastedText = event.clipboardData.getData('text')
  const newOtp = [...props.otpInputs]
  inputs.value.forEach((input: any, i: any) => {
    if (i < pastedText.length) {
      newOtp[i] = pastedText[i]
    }
  })
  emit('update:otpInputs', newOtp)
  emit('update:otpCode', pastedText)
}

const onKeyPress = (event: any) => {
  // Only allow numbers
  var charCode = event.which ? event.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  } else {
    return true
  }
}
</script>
