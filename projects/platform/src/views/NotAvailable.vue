<template lang="pug">
div(
  class="bg-brand-solid flex justify-center items-center w-full h-full text-primary"
  data-theme="new"
)
  div(class="max-w-[41rem] flex flex-col gap-5 h-full flex-1 justify-center my-5 mx-10")
    f-svg-icon(iconName="frontier" size="48" class="text-grey-0")
    p(class="text-2xl font-bold") {{ $t('UU0194') }}
    p(class="text-2xl") {{ $t('UU0195') }}
    div(@click="openModalSendFeedback")
      f-button(
        size="lg"
        type="secondary"
        class="inline-block text-green-50-v1 hover:bg-green-50-v1 px-3 py-2"
      ) {{ $t('UU0196') }}
</template>

<script lang="ts" setup>
const CONTACT_LINK = 'https://www.frontier.cool/pages/contact'
import { useUserStore } from '@/stores/user'
import { useStore } from 'vuex'

const store = useStore()
const userStore = useUserStore()

userStore.checkHasLogin()

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
    properties: {
      showEmail: !userStore.hasLogin,
    },
  })
}
</script>
