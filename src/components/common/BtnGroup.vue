<template lang="pug">
div(class="flex justify-center items-center")
  div(v-if="secondaryButton" class="grid grid-cols-2 gap-x-3")
    btn(size="md" type="secondary" @click="$emit('click:secondary')") {{secondaryText !== '' ? secondaryText : $t('UU0002')}}
    btn(size="md" @click="$emit('click:primary')") {{primaryText}}
  btn(v-else-if="primaryButton" size="md" @click="$emit('click:primary')") {{primaryText}}
</template>

<script>
export default {
  name: 'BtnGroup',
  props: {
    primaryButton: {
      type: Boolean,
      default: true
    },
    primaryText: {
      type: String,
      default: ''
    },
    secondaryButton: {
      type: Boolean,
      default: true
    },
    secondaryText: {
      type: String,
      default: ''
    }
  },
  emits: ['click:primary', 'click:secondary']
}
</script>
