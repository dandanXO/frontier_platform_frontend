<template lang="pug">
old-input-text(:inputType="isVisible ? 'text' : 'password'")
  template(#appendIcon)
    svg-icon(
      class="mr-2"
      size="24"
      :class="[isVisible ? 'text-primary' : 'text-black-400']"
      :iconName="isVisible ? 'openeye' : 'hideeye'"
      @click="isVisible = !isVisible"
    )
</template>

<script>
import { ref } from '@vue/reactivity'

export default {
  name: 'OldInputPassword',
  setup () {
    const isVisible = ref(false)
    return {
      isVisible
    }
  }
}
</script>
