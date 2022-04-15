<template lang="pug">
div(class="w-113.5")
  div(class="px-8")
    h6(class="text-h6 font-bold text-primary pb-7.5 text-center") {{ $t("RR0079") }}
    div(class="flex items-end justify-between pb-7.5 gap-7")
      div(class="text-body2 text-primary flex flex-col justify-between")
        p(class="font-bold pb-2") {{ $t("RR0156") }}
        p(class="leading-normal") {{ $t("RR0150") }}
      btn(size="sm" class="flex-shrink-0" @click="openModalPublicLibraryShareAssigned") {{ $t("UU0067") }}
  div(class="grid gap-10 grid-cols-4 bg-black-100 py-5 px-14 justify-items-center text-primary")
    div(class="cursor-pointer" @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.LINKEDIN)")
      img(src="@/assets/images/linkedin.png")
      p(class="text-caption text-center pt-3") {{ $t("RR0151") }}
    div(class="cursor-pointer" @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.FACEBOOK)")
      img(src="@/assets/images/facebook.png")
      p(class="text-caption text-center pt-3") {{ $t("RR0152") }}
    div(class="cursor-pointer" @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.TWITTER)")
      img(src="@/assets/images/twitter.png")
      p(class="text-caption text-center pt-3") {{ $t("RR0153") }}
    div(:class="[isCanShared ? 'cursor-pointer' : '']" @click="generateCopyLink")
      div(class="w-14 h-14 flex justify-center items-center bg-primary-thin rounded-full")
        svg-icon(iconName="link_1" size="30" class="text-primary transform -rotate-45" :class="{ 'text-black-500': !isCanShared }")
      p(class="text-caption text-center pt-3" :class="{ 'text-black-500': !isCanShared }") {{ $t("RR0154") }}
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { SOCIAL_MEDIA_TYPE } from '@/utils/constants.js'
import { shareViaCopyLink, shareViaSocialMedia } from '@/utils/share.js'

export default {
  name: 'ModalPublicLibraryShare',
  props: {
    workspaceNodeId: {
      type: Number,
      required: true
    },
    workspaceNodeLocation: {
      type: Number,
      required: true
    },
    isCanShared: {
      type: Boolean,
      required: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()

    const shareToSocialMedia = async (type) => {
      const sharingKey = await store.dispatch('publicLibrary/generateSocialMedia', { workspaceNodeId: props.workspaceNodeId, workspaceNodeLocation: props.workspaceNodeLocation, type })
      shareViaSocialMedia(sharingKey, type)
    }

    const generateCopyLink = async () => {
      if (!props.isCanShared) {
        return
      }

      store.dispatch('helper/pushModalLoading')
      const sharingKey = await store.dispatch('publicLibrary/generateCopyLink', { workspaceNodeId: props.workspaceNodeId, workspaceNodeLocation: props.workspaceNodeLocation })
      shareViaCopyLink(sharingKey)
      store.dispatch('helper/closeModalLoading')
      store.commit('helper/PUSH_message', t('RR0149'))
    }

    const openModalPublicLibraryShareAssigned = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-public-library-share-assigned',
        properties: {
          workspaceNodeId: props.workspaceNodeId,
          workspaceNodeLocation: props.workspaceNodeLocation
        }
      })
    }

    return {
      shareToSocialMedia,
      generateCopyLink,
      SOCIAL_MEDIA_TYPE,
      openModalPublicLibraryShareAssigned
    }
  }
}
</script>
