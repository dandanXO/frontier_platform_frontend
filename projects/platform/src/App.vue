<template lang="pug">
router-view
f-snackbar(
  v-bind="notify.notifySnackbarProps"
  @update:isShowSnackbar="notify.closeNotifySnackbar"
)
modal-pipeline
</template>

<script setup>
import ModalPipeline from '@/components/common/modal/ModalPipeline.vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'

const store = useStore()
store.dispatch('code/fetchCode')
const notify = useNotifyStore()
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
