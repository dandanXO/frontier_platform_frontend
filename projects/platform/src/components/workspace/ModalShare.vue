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
                  v-if="shareList.length > 0"
                  :itemList="shareList.map((share) => ({ imageUrl: share.unitLogo, name: share.unitName }))"
                  class="mr-6"
                )
                p {{ $t('FF0058', { number: shareList.length }) }}
              f-button(
                size="sm"
                type="secondary"
                :disabled="shareList.length === 0"
                @click="openModalShareAssignedList"
              ) {{ $t('UU0027') }}
        template(v-else-if="currentTab === TAB.COPY_LINK")
          div(class="h-full flex flex-col justify-between")
            div(class="flex items-center justify-between")
              f-input-container(:label="$t('FF0063')")
                f-input-switch(
                  iconSize="30"
                  :label="$t('FF0064')"
                  v-model:inputValue="isCanShared"
                  @update:inputValue="toggleCopyLink"
                )
              f-button(
                size="sm"
                :disabled="!isCanShared"
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
                  v-model:inputValue="embed.isCanDownloadU3M"
                  @update:inputValue="updateEmbedDownloadPermission"
                )
              f-button(size="sm" @click="copyEmbedIFrameCode") {{ $t('UU0068') }}
            f-infobar(:messageText="$t('FF0071')")
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import {
  shareViaCopyLink,
  shareViaSocialMedia,
  SOCIAL_MEDIA_TYPE,
} from '@/utils/share'
import { copyText } from '@frontier/lib'
import { type NodeChild, NodeType } from '@frontier/platform-web-sdk'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'

export interface PropsModalShare {
  node: NodeChild
}

const props = defineProps<PropsModalShare>()

const { t } = useI18n()
const workspaceStore = useWorkspaceStore()
const { ogBaseWorkspaceApi, getWorkspaceNodeShareInfo } = workspaceStore
const { shareList, embed, isCanShared } = storeToRefs(workspaceStore)
const store = useStore()
const notify = useNotifyStore()

const TAB = {
  ASSIGNED: 0,
  COPY_LINK: 1,
  SOCIAL_MEDIA: 2,
  EMBED: 3,
}
const nodeId = computed(() => props.node.nodeMeta.nodeId)

await getWorkspaceNodeShareInfo(nodeId.value)

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
  if (props.node.nodeMeta.nodeType === NodeType.COLLECTION) {
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
      nodeId: nodeId.value,
    },
  })
}

const openModalShareAssignedList = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-share-assigned-list',
    properties: {
      nodeId: nodeId.value,
    },
  })
}

const shareToSocialMedia = async (type: SOCIAL_MEDIA_TYPE) => {
  const res = await ogBaseWorkspaceApi('generateWorkspaceNodeShareSocial', {
    nodeId: nodeId.value,
    type,
  })
  shareViaSocialMedia(res.data.result.key, type)
}

const toggleCopyLink = () =>
  ogBaseWorkspaceApi('updateWorkspaceNodeShareCopyLink', {
    nodeId: nodeId.value,
    isCanShared: isCanShared.value,
  })

const generateCopyLink = async () => {
  store.dispatch('helper/pushModalLoading')
  const res = await ogBaseWorkspaceApi('generateWorkspaceNodeShareCopyLink', {
    nodeId: nodeId.value,
  })
  shareViaCopyLink(res.data.result.key)
  store.dispatch('helper/closeModalLoading')
  notify.showNotifySnackbar({ messageText: t('RR0149') })
}

const updateEmbedDownloadPermission = () =>
  embed.value &&
  ogBaseWorkspaceApi('updateWorkspaceNodeShareEmbed', {
    embedKey: embed.value.key,
    isCanDownloadU3M: embed.value.isCanDownloadU3M,
  })

const copyEmbedIFrameCode = () => {
  embed.value &&
    copyText(
      `<iframe width="100%" height="100%" src="${window.location.origin}/embed/${embed.value.key}/${nodeId.value}" title="Frontier.cool" frameborder="0"></iframe>`
    )
  notify.showNotifySnackbar({ messageText: t('RR0149') })
}
</script>
