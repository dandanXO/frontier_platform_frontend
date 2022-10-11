<template lang="pug">
div(class="relative")
  slot(name="slot:label")
    div(v-if="label !== ''" class="flex pb-2 text-body2 font-bold")
      i(v-if="required" class="text-red-400 pr-0.5") *
      p(class="text-grey-900") {{ label }}
  slot
  slot(name="slot:hint")
</template>

<script>
export default {
  name: 'FInputContainer',
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  }
}
</script>
