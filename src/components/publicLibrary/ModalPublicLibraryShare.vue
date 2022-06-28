<template lang="pug">
modal-behavior(
  :header="$t('RR0079')"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="closeModal"
)
  div(class="w-103.5")
    div(class="flex items-end justify-between pb-7.5 gap-7")
      div(class="text-body2 text-primary flex flex-col justify-between")
        p(class="font-bold pb-2") {{ $t("RR0156") }}
        p(class="leading-normal") {{ $t("RR0150") }}
      btn(size="sm" class="flex-shrink-0" @click="openModalPublicLibraryShareAssigned") {{ $t("UU0067") }}
  div(class="grid gap-10 grid-cols-4 bg-black-100 py-5 px-10 justify-items-center text-primary")
    div(class="cursor-pointer" @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.LINKEDIN)")
      img(src="@/assets/images/linkedin.png" class="w-14")
      p(class="text-caption text-center pt-3") {{ $t("RR0151") }}
    div(class="cursor-pointer" @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.FACEBOOK)")
      img(src="@/assets/images/facebook.png" class="w-14")
      p(class="text-caption text-center pt-3") {{ $t("RR0152") }}
    div(class="cursor-pointer" @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.TWITTER)")
      img(src="@/assets/images/twitter.png" class="w-14")
      p(class="text-caption text-center pt-3") {{ $t("RR0153") }}
    div(:class="[isCanShared ? 'cursor-pointer' : '']" @click="generateCopyLink")
      div(class="w-14 h-14 flex justify-center items-center bg-primary-thin rounded-full")
        svg-icon(iconName="link_1" size="30" class="text-primary transform -rotate-45" :class="{ 'text-black-500': !isCanShared }")
      p(class="text-caption text-center pt-3" :class="{ 'text-black-500': !isCanShared }") {{ $t("RR0154") }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { SOCIAL_MEDIA_TYPE } from '@/utils/constants.js'
import { shareViaCopyLink, shareViaSocialMedia } from '@/utils/share.js'

const props = defineProps({
  nodeKey: {
    type: String,
    required: true
  },
  isCanShared: {
    type: Boolean,
    required: true
  }
})

const { t } = useI18n()
const store = useStore()

const shareToSocialMedia = async (type) => {
  const sharingKey = await store.dispatch('publicLibrary/generateSocialMedia', { nodeKey: props.nodeKey, type })
  shareViaSocialMedia(sharingKey, type)
}

const generateCopyLink = async () => {
  if (!props.isCanShared) {
    return
  }

  store.dispatch('helper/pushModalLoading')
  const sharingKey = await store.dispatch('publicLibrary/generateCopyLink', { nodeKey: props.nodeKey })
  shareViaCopyLink(sharingKey)
  store.dispatch('helper/closeModalLoading')
  store.commit('helper/PUSH_message', t('RR0149'))
}

const openModalPublicLibraryShareAssigned = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-public-library-share-assigned',
    properties: {
      nodeKey: props.nodeKey
    }
  })
}

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
