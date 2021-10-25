<template lang="pug">
div(class="relative")
  slot(name="label")
    div(v-if="label !== ''" class="flex pb-2 text-body2 font-bold")
      i(v-if="required" class="text-warn") *
      p(class="text-primary") {{label}}
  slot
  slot(name="hint")
</template>

<script>
export default {
  name: 'InputContainer',
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
