<template lang="pug">
fullscreen-header
  template(#left)
    img(:src="moodboardShare.logo" class="w-10 h-10 rounded-full")
    div(class="flex items-end pl-2")
      p(class="text-body1 font-bold text-primary pr-2.5") {{ moodboardShare.displayName }}
      p(class="text-caption text-black-700") {{ $t("QQ0083") }}:  {{ $dayjs.unix(moodboardShare.shareDate).format("YYYY/MM/DD") }}
  template(#right)
    div(class="relative cursor-pointer mr-4" @click="openModalShareMessage")
      svg-icon(iconName="chat" size="24" class="text-black-700")
      div(v-if="hasMsg" class="absolute -top-px -right-px w-2 h-2 rounded-full border border-black-0 bg-warn")
    btn(size="md" @click="saveReceivedShare") {{ $t("UU0018") }}
  template(#content)
    div(class="w-227 mx-auto mt-11")
      div(class="mb-6")
        p(class="text-caption text-black-700 mb-2") {{ $t("QQ0001") }}
        p(class="text-h5 font-bold text-primary mb-3") {{ moodboard.moodboardName }}
        p(class="text-caption text-black-700")
          span {{ $t("RR0066") }}: {{ $dayjs.unix(moodboard.updateDate).format("YYYY/MM/DD") }}
          span(class="mx-1") at
          span {{ $dayjs.unix(moodboard.updateDate).format("h:mm a") }}
      div(class="mb-6 flex")
        div(class="w-97.5 h-69 bg-black-200 rounded py-6 px-7.5 flex-shrink-0 mr-9")
          div(class="relative h-full bg-cover bg-center rounded flex items-center justify-center" :style="{ backgroundImage: `url(${moodboard.trendBoardCoverImg})` }")
            p(v-if="!moodboard.trendBoardCoverImg" class="text-body2 leading-1.6 text-black-400") {{ $t("QQ0074") }}
            a(v-else :href="moodboard.trendBoardUrl" target="_blank" class="absolute w-6 h-6 bg-black-0 rounded -bottom-2 -right-3.5 flex items-center justify-center cursor-pointer" style="box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15)")
              svg-icon(iconName="search" size="20" class="text-black-700")
        div(class="text-primary")
          p(class="text-caption font-bold mb-3") {{ $t("RR0014") }}
          p(class="text-body2 leading-1.6") {{ moodboard.description }}
      block-attachment(:attachmentList="moodboard.attachmentList")
    div(class="fixed z-footer bottom-0 w-full h-13 bg-black-100 px-36 flex items-center justify-end card-shadow")
      p(class="text-body2 text-primary") {{ $t("GG0004") }}
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useNavigation from '@/composables/useNavigation'
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import BlockAttachment from '@/components/moodboard/BlockAttachment.vue'
import { MOODBOARD_TYPE } from '@/utils/constants'

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const router = useRouter()
const { goToLobby } = useNavigation()

const sharingKey = route.params.sharingKey
const { moodboardShare, moodboard } = await store.dispatch('moodboard/getMoodboardReceivedShare', { sharingKey })

const hasMsg = ref(moodboardShare.message.length > 0)

const openModalShareMessage = () => {
  hasMsg.value = false
  store.dispatch('helper/openModal', {
    component: 'modal-share-message',
    header: t('RR0146'),
    properties: {
      message: moodboardShare.message
    }
  })
}

const saveReceivedShare = async () => {
  if (!moodboardShare.isCanSave) {
    store.dispatch('helper/openModalConfirm', {
      type: 3,
      header: t('RR0214'),
      content: t('QQ0084'),
      primaryBtnText: t('UU0031'),
      secondaryBtnText: t('UU0106'),
      secondaryBtnHandler: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push({ name: 'SignIn', query: { redirect: `${window.location.pathname}${window.location.search}` } })
      }
    })
    return
  }

  store.dispatch('helper/openModalLoading')
  await store.dispatch('user/getUser')
  const organizationList = store.getters['user/organizationList']

  if (organizationList.length === 0) {
    store.dispatch('helper/openModalConfirm', {
      type: 3,
      header: t('GG0010'),
      content: t('GG0033'),
      primaryBtnText: t('UU0072'),
      primaryBtnHandler: goToLobby,
      secondaryBtnText: t('UU0002')
    })
  } else {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-choose-save-place',
      properties: {
        title: t('RR0213'),
        actionHandler: async ({ orgId, groupId }) => {
          store.dispatch('helper/pushModalLoading')
          await store.dispatch('moodboard/saveMoodboardReceivedShare', { orgId, groupId, sharingKey })
          store.dispatch('helper/closeModalLoading')

          const orgNo = store.getters['user/organizationList'].find(org => org.orgId === orgId).orgNo
          let prefixUrl
          if (groupId) {
            prefixUrl = `${orgNo}/${groupId}`
          } else {
            prefixUrl = `${orgNo}`
          }
          window.open(`${window.location.origin}/${prefixUrl}/moodboard?tab=${MOODBOARD_TYPE.PROVIDER}`, '_blank')
        }
      }
    })
  }
}
</script>
