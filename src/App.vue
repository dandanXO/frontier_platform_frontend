<template lang="pug">
router-view
flash-message
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup () {
    const store = useStore()
    store.dispatch('code/getRoleList')
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
