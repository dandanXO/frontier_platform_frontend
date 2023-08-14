<template lang="pug">
f-banner(
  v-if="notify.isShowNotifyBanner"
  v-bind="notify.notifyBannerProps"
  class="flex-shrink-0"
  @close="notify.closeNotifyBanner"
)
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

#app {
  font-family: 'Noto Sans TC', '微軟正黑體', sans-serif;
  @apply h-full flex flex-col;
}
</style>
