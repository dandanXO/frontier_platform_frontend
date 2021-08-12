<template lang="pug">
input-text(:inputType="isVisible ? 'text' : 'password'" prependIcon="lock")
  template(#appendIcon)
    svg-icon(
      size="20"
      :class="[isVisible ? 'text-primary' : 'text-black-400']"
      :iconName="isVisible ? 'openeye' : 'hideeye'"
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
