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
import { setOptions, bootstrap, config } from 'vue-gtag'
import ModalPipeline from '@/components/common/modal/ModalPipeline.vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { computed, watch } from 'vue'

const store = useStore()
const user = computed(() => store.getters['user/user'])
store.dispatch('code/fetchCode')
const notify = useNotifyStore()

/** GA */
setOptions({
  config: {
    id: import.meta.env.VITE_APP_GA_MEASUREMENT_ID,
  },
})
bootstrap()

watch(
  () => user.value.email,
  () => {
    config({
      user_id: user.value.email,
    })
  },
  {
    deep: true,
  }
)
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';

#app {
  font-family: 'Noto Sans TC', '微軟正黑體', sans-serif;
  @apply h-full flex flex-col;
}
</style>
