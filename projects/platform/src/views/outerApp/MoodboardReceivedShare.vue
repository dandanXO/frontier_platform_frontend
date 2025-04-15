<template lang="pug">
fullscreen-header
  template(v-if="moodboardShare" #left)
    img(:src="moodboardShare.logo" class="w-10 h-10 rounded-full")
    div(class="flex items-end pl-2")
      p(class="text-body1 font-bold text-grey-900 pr-2.5") {{ moodboardShare.displayName }}
      p(class="text-caption text-grey-600") {{ $t('QQ0083') }}: {{ toYYYYMMDDFormat(moodboardShare.shareDate) }}
  template(v-if="moodboardShare" #right)
    div(class="relative cursor-pointer mr-4" @click="openModalShareMessage")
      f-svg-icon(iconName="chat" size="24" class="text-grey-600")
      div(
        v-if="moodboardShare.message"
        class="absolute -top-px -right-px w-2 h-2 rounded-full border border-grey-0 bg-red-400"
      )
    f-button(size="md" @click="saveReceivedShare") {{ $t('UU0018') }}
  template(v-if="moodboard" #content)
    div(class="w-227 mx-auto mt-11")
      div(class="mb-6")
        p(class="text-caption text-grey-600 mb-2") {{ $t('QQ0001') }}
        p(class="text-h5 font-bold text-grey-900 mb-3") {{ moodboard.moodboardName }}
        p(class="text-caption text-grey-600")
          span {{ $t('RR0066') }}: &nbsp
          span {{ toYYYYMMDDFormat(moodboard.updateDate) }}
      div(class="mb-6 flex")
        collection-trend-board(
          class="mr-9"
          :trendBoardCoverImg="moodboard.trendBoard?.thumbnailUrl"
          :trendBoardUrl="moodboard.trendBoard?.originalUrl"
        )
        div(class="text-grey-900")
          p(class="text-caption font-bold mb-3") {{ $t('RR0014') }}
          p(class="text-body2 break-all leading-1.6") {{ moodboard.description }}
      block-attachment(:attachmentList="moodboard.attachmentList")
    div(
      class="fixed z-footer bottom-0 w-full h-13 bg-grey-50 px-36 flex items-center justify-end shadow-4 border-t border-grey-150"
    )
      p(class="text-body2 text-grey-900") {{ $t('GG0004') }}
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useNavigation from '@/composables/useNavigation'
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import BlockAttachment from '@/components/moodboard/BlockAttachment.vue'
import { NOTIFY_TYPE } from '@/utils/constants'
import CollectionTrendBoard from '@/components/common/collection/CollectionTrendBoard.vue'
import { toYYYYMMDDFormat } from '@frontier/lib'
import moodboardApi from '@/apis/moodboard'
import type {
  Organization,
  OgType,
  Moodboard,
  GetMoodboardShareReceivedInfo200ResponseAllOfResultMoodboardShare,
} from '@frontier/platform-web-sdk'
import type { PropsModalChooseSavePlace } from '@/components/common/ModalChooseSavePlace.vue'
import { accessToken, refreshToken } from '@/utils/storage'

const props = defineProps<{
  sharingKey: string
}>()

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const { goToLobby } = useNavigation()
const moodboard = ref<Moodboard>()
const moodboardShare =
  ref<GetMoodboardShareReceivedInfo200ResponseAllOfResultMoodboardShare>()

onMounted(async () => {
  const { data } = await moodboardApi.getMoodboardShareReceivedInfo({
    sharingKey: props.sharingKey,
  })

  moodboard.value = data.result.moodboard
  moodboardShare.value = data.result.moodboardShare
})

const openModalShareMessage = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-share-message',
    properties: {
      message: moodboardShare.value?.message,
    },
  })
}

const openNewTabAndGoToAssets = (
  ogNo: string,
  ogType: OgType,
  ogId: number
) => {
  window.open(
    `${window.location.origin}/${ogNo}/${ogType}-${ogId}/assets`,
    '_blank'
  )
}

const saveReceivedShare = async () => {
  if (!moodboardShare.value?.isCanSave) {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.ALERT,
      header: t('RR0214'),
      contentText: t('QQ0084'),
      primaryBtnText: t('UU0031'),
      secondaryBtnText: t('UU0106'),
      secondaryBtnHandler: () => {
        accessToken.value = null
        refreshToken.value = null
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
  const organizationList = store.getters[
    'user/organizationList'
  ] as Organization[]

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
        actionHandler: async (targetOrgId, targetOgType, targetOgId) => {
          store.dispatch('helper/pushModalLoading')
          await moodboardApi.saveMoodboardShareReceived({
            sharingKey: props.sharingKey,
            targetOrgId,
            targetOgType,
            targetOgId,
          })
          store.dispatch('helper/closeModalLoading')
          const org = organizationList.find((org) => org.orgId === targetOrgId)!
          openNewTabAndGoToAssets(org.orgNo, targetOgType, targetOgId)
          store.dispatch('helper/clearModalPipeline')
        },
      } as PropsModalChooseSavePlace,
    })
  }
}
</script>
