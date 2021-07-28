<template lang="pug">
input-text(:inputType="isVisible ? 'text' : 'password'")
  template(#appendIcon)
    svg-icon(
      class="mr-2"
      :iconName="isVisible ? 'openeye' : 'hideeye'"
      :color="isVisible ? 'primary' : 'black-400'"
      @click="isVisible = !isVisible"
    )
</template>

<script>
import { ref } from '@vue/reactivity'

export default {
  name: 'InputPassword',
  setup () {
    const isVisible = ref(false)
    return {
      isVisible
    }
  }
}
</script>
