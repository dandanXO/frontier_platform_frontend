<template lang="pug">
fullscreen-header
  template(#left)
    template(v-if="share.sharingFrom === SHARING_FROM.WORKSPACE")
      img(:src="logo" class="w-10 h-10 rounded-full")
      div(class="flex items-end pl-2")
        p(class="text-body1 font-bold text-primary pr-2.5") {{ share.displayName }}
        p(class="text-caption text-black-700") {{ $t("RR0148") }} {{ $dayjs.unix(share.shareDate).format("YYYY/MM/DD") }}
    template(v-else-if="share.sharingFrom === SHARING_FROM.PUBLIC_LIBRARY")
      p(class="text-body1 font-bold text-primary pr-2.5") {{ $t("GG0032") }}
      img(:src="logo" class="w-10 h-10 rounded-full")
      p(class="text-body1 font-bold text-primary pl-2.5") {{ share.displayName }}
  template(#right)
    div(class="relative cursor-pointer mr-4" @click="openModalShareMessage")
      f-svg-icon(iconName="chat" size="24" class="text-black-700")
      div(v-if="haveMsgAndFirstRead" class="absolute -top-px -right-px w-2 h-2 rounded-full border border-black-0 bg-warn")
    f-button(size="md" :disabled="share.isClosed" @click="saveReceivedShare") {{ $t("UU0018") }}
  template(#content)
    div(v-if="share.isClosed" class="w-full h-full flex items-center justify-center")
      p(class="text-body1 text-primary") {{ $t("GG0026") }}
    router-view(v-else)
    div(class="fixed z-footer bottom-0 w-full h-13 bg-black-100 px-36 flex items-center justify-end card-shadow")
      img(src="@/assets/images/frontier_logo.png" class="w-20.5 h-4 mr-2")
      p(class="text-body2 text-primary") {{ $t("GG0004") }}
</template>

<script setup>
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import { SHARING_FROM } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()
const { saveReceivedShare } = useReceivedShare()

const share = computed(() => store.getters['receivedShare/share'])
const logo = computed(() => store.getters['receivedShare/logo'])
const isFirstTime = ref(true)
const haveMsgAndFirstRead = computed(() => !!share.value.message && isFirstTime.value)

const openModalShareMessage = () => {
  isFirstTime.value = false
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-share-message',
    properties: {
      message: share.value.message
    }
  })
}
</script>
