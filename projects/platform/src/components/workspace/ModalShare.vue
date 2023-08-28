<template lang="pug">
modal-behavior(:header="$t('RR0079')")
  f-tabs(:tabList="tabList" keyField="id")
    template(#default="{ currentTab }")
      div(class="w-101 h-43 pt-7.5")
        template(v-if="currentTab === TAB.ASSIGNED")
          div(class="flex items-end justify-between pb-6 gap-7")
            div(class="text-body2 text-grey-900 flex flex-col justify-between")
              p(class="font-bold pb-2") {{ $t('RR0156') }}
              p(class="leading-normal") {{ $t('RR0150') }}
            f-button(size="sm" class="flex-shrink-0" @click="openModalShareAssigned") {{ $t('UU0067') }}
          div(class="text-body2 text-grey-900")
            p(class="font-bold pb-2") {{ $t('FF0057') }}
            div(class="flex items-center justify-between")
              div(class="flex items-center")
                f-avatar-group(
                  v-if="shareInfo.shareList.length > 0"
                  :itemList="shareInfo.shareList.map((share) => ({ imageUrl: share.logo, name: share.name }))"
                  class="mr-6"
                )
                p {{ $t('FF0058', { number: shareInfo.shareList.length }) }}
              f-button(
                size="sm"
                type="secondary"
                :disabled="shareInfo.shareList.length === 0"
                @click="openModalShareAssignedList"
              ) {{ $t('UU0027') }}
        template(v-else-if="currentTab === TAB.COPY_LINK")
          div(class="h-full flex flex-col justify-between")
            div(class="flex items-center justify-between")
              f-input-container(:label="$t('FF0063')")
                f-input-switch(
                  iconSize="30"
                  :label="$t('FF0064')"
                  v-model:inputValue="shareInfo.isCanShared"
                  @update:inputValue="toggleCopyLink"
                )
              f-button(
                size="sm"
                :disabled="!shareInfo.isCanShared"
                @click="generateCopyLink"
              ) {{ $t('UU0068') }}
            f-infobar(:messageText="$t('FF0062')")
        template(v-else-if="currentTab === TAB.SOCIAL_MEDIA")
          div(
            class="grid gap-8.5 grid-cols-4 bg-grey-50 py-5 px-8 justify-items-center text-grey-900"
          )
            div(
              class="cursor-pointer"
              @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.LINKEDIN)"
            )
              img(src="@/assets/images/linkedin.png")
              p(class="text-caption text-center pt-3") {{ $t('RR0151') }}
            div(
              class="cursor-pointer"
              @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.FACEBOOK)"
            )
              img(src="@/assets/images/facebook.png")
              p(class="text-caption text-center pt-3") {{ $t('RR0152') }}
            div(
              class="cursor-pointer"
              @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.TWITTER)"
            )
              img(src="@/assets/images/twitter.png")
              p(class="text-caption text-center pt-3") {{ $t('RR0153') }}
        template(v-else-if="currentTab === TAB.EMBED")
          div(class="h-full flex flex-col justify-between")
            div(class="flex items-center justify-between")
              f-input-container(:label="$t('FF0067')")
                f-input-switch(
                  iconSize="30"
                  :label="$t('FF0033')"
                  v-model:inputValue="shareInfo.embed.isCanDownloadU3M"
                  @update:inputValue="updateEmbedDownloadPermission"
                )
              f-button(size="sm" @click="copyEmbedIFrameCode") {{ $t('UU0068') }}
            f-infobar(:messageText="$t('FF0071')")
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { SOCIAL_MEDIA_TYPE } from '@/utils/constants'
import { shareViaCopyLink, shareViaSocialMedia } from '@/utils/share.js'
import { NODE_TYPE } from '@/utils/constants'
import { copyText } from '@frontier/utils'

const props = defineProps({
  workspaceNodeId: {
    type: [String, Number],
    required: true,
  },
  nodeKey: {
    type: String,
    required: true,
  },
  nodeType: {
    type: Number,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()

const TAB = {
  ASSIGNED: 0,
  COPY_LINK: 1,
  SOCIAL_MEDIA: 2,
  EMBED: 3,
}
const shareInfo = computed(() => store.getters['workspace/shareInfo'])
const tabList = computed(() => {
  const list = [
    {
      id: TAB.ASSIGNED,
      name: t('FF0051'),
    },
    {
      id: TAB.COPY_LINK,
      name: t('RR0154'),
    },
    {
      id: TAB.SOCIAL_MEDIA,
      name: t('FF0053'),
    },
  ]
  if (props.nodeType === NODE_TYPE.COLLECTION) {
    list.push({
      id: TAB.EMBED,
      name: t('FF0054'),
    })
  }
  return list
})
const openModalShareAssigned = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-share-assigned',
    properties: {
      workspaceNodeId: props.workspaceNodeId,
    },
  })
}

const openModalShareAssignedList = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-share-assigned-list',
    properties: {
      workspaceNodeId: props.workspaceNodeId,
    },
  })
}

const shareToSocialMedia = async (type) => {
  const sharingKey = await store.dispatch('workspace/generateSocialMedia', {
    workspaceNodeId: props.workspaceNodeId,
    type,
  })
  shareViaSocialMedia(sharingKey, type)
}

const toggleCopyLink = () =>
  store.dispatch('workspace/toggleCopyLink', {
    workspaceNodeId: props.workspaceNodeId,
    isCanShared: shareInfo.value.isCanShared,
  })

const generateCopyLink = async () => {
  store.dispatch('helper/pushModalLoading')
  const sharingKey = await store.dispatch('workspace/generateCopyLink', {
    workspaceNodeId: props.workspaceNodeId,
  })
  shareViaCopyLink(sharingKey)
  store.dispatch('helper/closeModalLoading')
  notify.showNotifySnackbar({ messageText: t('RR0149') })
}

const updateEmbedDownloadPermission = () =>
  store.dispatch('workspace/updateEmbedDownloadPermission', {
    embedKey: shareInfo.value.embed.key,
    isCanDownloadU3M: shareInfo.value.embed.isCanDownloadU3M,
  })

const copyEmbedIFrameCode = () => {
  copyText(
    `<iframe width="100%" height="100%" src="${window.location.origin}/embed/${shareInfo.value.embed.key}/${props.nodeKey}" title="Frontier.cool" frameborder="0"></iframe>`
  )
  notify.showNotifySnackbar({ messageText: t('RR0149') })
}

await store.dispatch('workspace/getShareInfo', {
  workspaceNodeId: props.workspaceNodeId,
})
</script>
