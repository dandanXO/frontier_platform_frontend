<template lang="pug">
fullscreen-header
  template(#left)
    img(:src="moodboardShare.logo" class="w-10 h-10 rounded-full")
    div(class="flex items-end pl-2")
      p(class="text-body1 font-bold text-grey-900 pr-2.5") {{ moodboardShare.displayName }}
      p(class="text-caption text-grey-600") {{ $t('QQ0083') }}: {{ $dayjs.unix(moodboardShare.shareDate).format('YYYY/MM/DD') }}
  template(#right)
    div(class="relative cursor-pointer mr-4" @click="openModalShareMessage")
      f-svg-icon(iconName="chat" size="24" class="text-grey-600")
      div(
        v-if="hasMsg"
        class="absolute -top-px -right-px w-2 h-2 rounded-full border border-grey-0 bg-red-400"
      )
    f-button(size="md" @click="saveReceivedShare") {{ $t('UU0018') }}
  template(#content)
    div(class="w-227 mx-auto mt-11")
      div(class="mb-6")
        p(class="text-caption text-grey-600 mb-2") {{ $t('QQ0001') }}
        p(class="text-h5 font-bold text-grey-900 mb-3") {{ moodboard.moodboardName }}
        p(class="text-caption text-grey-600")
          span {{ $t('RR0066') }}: {{ $dayjs.unix(moodboard.updateDate).format('YYYY/MM/DD') }}
          span(class="mx-1") at
          span {{ $dayjs.unix(moodboard.updateDate).format('h:mm a') }}
      div(class="mb-6 flex")
        div(
          class="relative w-97.5 h-69 rounded bg-grey-250 flex items-center justify-center flex-shrink-0 mr-9"
        )
          div(
            v-if="moodboard.trendBoardCoverImg"
            class="rounded w-full h-full px-7.5 py-6 bg-grey-100"
          )
            div(
              class="w-full h-full bg-contain bg-no-repeat bg-center rounded bg-grey-0"
              :style="{ backgroundImage: `url(${moodboard.trendBoardCoverImg})` }"
            )
            a(
              :href="moodboard.trendBoardUrl"
              target="_blank"
              class="absolute right-3.5 bottom-3.5 w-7 h-7 bg-grey-0 flex items-center justify-center rounded border border-grey-250"
            )
              f-svg-icon(iconName="open_in_new" class="text-grey-600" size="24")
          div(v-else)
            f-svg-icon(iconName="file" size="110" class="text-grey-0 mx-auto")
            p(class="text-body1 font-bold text-grey-50 pt-3") {{ $t('RR0247') }}
        div(class="text-grey-900")
          p(class="text-caption font-bold mb-3") {{ $t('RR0014') }}
          p(class="text-body2 break-all leading-1.6") {{ moodboard.description }}
      block-attachment(:attachmentList="moodboard.attachmentList")
    div(
      class="fixed z-footer bottom-0 w-full h-13 bg-grey-50 px-36 flex items-center justify-end shadow-4 border-t border-grey-150"
    )
      p(class="text-body2 text-grey-900") {{ $t('GG0004') }}
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useNavigation from '@/composables/useNavigation'
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import BlockAttachment from '@/components/moodboard/BlockAttachment.vue'
import { MOODBOARD_TYPE, NOTIFY_TYPE } from '@/utils/constants'

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const router = useRouter()
const { goToLobby } = useNavigation()

const sharingKey = route.params.sharingKey
const { moodboardShare, moodboard } = await store.dispatch(
  'moodboard/getMoodboardReceivedShare',
  { sharingKey }
)

const hasMsg = ref(moodboardShare.message.length > 0)

const openModalShareMessage = () => {
  hasMsg.value = false
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-share-message',
    properties: {
      message: moodboardShare.message,
    },
  })
}

const saveReceivedShare = async () => {
  if (!moodboardShare.isCanSave) {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.ALERT,
      header: t('RR0214'),
      contentText: t('QQ0084'),
      primaryBtnText: t('UU0031'),
      secondaryBtnText: t('UU0106'),
      secondaryBtnHandler: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push({
          name: 'SignIn',
          query: {
            redirect: `${window.location.pathname}${window.location.search}`,
          },
        })
      },
    })
    return
  }

  store.dispatch('helper/openModalLoading')
  await store.dispatch('user/getUser')
  const organizationList = store.getters['user/organizationList']

  if (organizationList.length === 0) {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.ALERT,
      header: t('GG0010'),
      contentText: t('GG0033'),
      primaryBtnText: t('UU0072'),
      primaryBtnHandler: goToLobby,
      secondaryBtnText: t('UU0002'),
    })
  } else {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-choose-save-place',
      properties: {
        title: t('RR0213'),
        actionHandler: async ({ orgId, groupId }) => {
          store.dispatch('helper/pushModalLoading')
          await store.dispatch('moodboard/saveMoodboardReceivedShare', {
            orgId,
            groupId,
            sharingKey,
          })
          store.dispatch('helper/closeModalLoading')

          const orgNo = store.getters['user/organizationList'].find(
            (org) => org.orgId === orgId
          ).orgNo
          let prefixUrl
          if (groupId) {
            prefixUrl = `${orgNo}/${groupId}`
          } else {
            prefixUrl = `${orgNo}`
          }
          window.open(
            `${window.location.origin}/${prefixUrl}/moodboard?tab=${MOODBOARD_TYPE.PROVIDER}`,
            '_blank'
          )
        },
      },
    })
  }
}
</script>
