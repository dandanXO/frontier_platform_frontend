<template lang="pug">
router-view
flash-message
</template>

<script>
import ModalPipeline from '@/components/modal/ModalPipeline.vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: {
    ModalPipeline
  },
  setup () {
    const store = useStore()
    store.dispatch('code/getRoleList')
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
