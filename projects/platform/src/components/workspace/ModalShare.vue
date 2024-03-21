<template lang="pug">
modal-behavior(
  :header="$t('RR0079')"
  :secondaryBtnText="$t('UU0002')"
  @click:secondary="closeModal"
)
  f-tabs(:tabList="tabList" keyField="id")
    template(#default="{ currentTab }")
      div(class="w-101 h-43 pt-5")
        template(v-if="currentTab === TAB.ASSIGNED")
          div(class="flex flex-col gap-6")
            div(class="text-body2 text-grey-900 flex flex-col justify-between")
              p(class="font-bold pb-2") {{ $t('RR0344') }}
              div(class="flex items-end justify-between")
                p(class="leading-normal") {{ $t('FF0074') }}
                f-button(
                  size="sm"
                  class="flex-shrink-0"
                  prependIcon="person_add"
                  @click="openModalShareAssigned"
                ) {{ $t('UU0144') }}
            div(class="text-body2 text-grey-900 flex flex-col justify-between")
              p(class="font-bold pb-2") {{ $t('RR0155') }}
              div(class="flex items-end justify-between")
                p(class="leading-normal") {{ $t('FF0075') }}
                f-button(
                  size="sm"
                  class="flex-shrink-0"
                  prependIcon="person_add"
                  @click="openModalShareAssignedPeople"
                ) {{ $t('UU0145') }}
        template(v-else-if="currentTab === TAB.COPY_LINK")
          div(class="h-full flex flex-col gap-y-2")
            p(class="text-body2 font-bold text-primary-900") {{ $t('FF0063') }}
            div(class="flex items-center justify-between")
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
            f-infobar(
              :notifyType="NOTIFY_TYPE.WARNING"
              :messageText="$t('FF0062')"
            )
        template(v-else-if="currentTab === TAB.SOCIAL_MEDIA")
          div(class="flex gap-8 bg-grey-50 py-5 justify-center text-grey-900")
            div(class="cursor-pointer" @click="shareToSocialMedia(SocialMedia.LINKEDIN)")
              div(
                class="w-16 h-16 flex justify-center items-center bg-primary-400 rounded-full"
              )
                f-svg-icon(iconName="linkedin" size="40" class="text-grey-0")
              p(class="text-caption text-center pt-3") {{ $t('RR0151') }}
            div(class="cursor-pointer" @click="shareToSocialMedia(SocialMedia.FACEBOOK)")
              div(
                class="w-16 h-16 flex justify-center items-center bg-primary-400 rounded-full"
              )
                f-svg-icon(iconName="facebook" size="40" class="text-grey-0")
              p(class="text-caption text-center pt-3") {{ $t('RR0152') }}
            div(class="cursor-pointer" @click="shareToSocialMedia(SocialMedia.TWITTER)")
              div(
                class="w-16 h-16 flex justify-center items-center bg-primary-400 rounded-full"
              )
                f-svg-icon(iconName="twitter" size="40" class="text-grey-0")
              p(class="text-caption text-center pt-3") {{ $t('RR0153') }}
        template(v-else-if="currentTab === TAB.EMBED")
          div(class="h-full flex flex-col gap-y-6")
            div(v-if="embed")
              p(class="text-body2 font-bold text-primary-900 pb-2") {{ $t('FF0067') }}
              f-input-switch(
                iconSize="30"
                :label="$t('FF0033')"
                v-model:inputValue="embed.isCanDownloadU3M"
                @update:inputValue="updateEmbedDownloadPermission"
              )
              div(class="flex items-center justify-between")
                div(class="flex items-center gap-2")
                  f-input-switch(
                    iconSize="30"
                    :label="$t('FF0086')"
                    v-model:inputValue="embed.isEnablePrivateView"
                    @update:inputValue="updateEmbedDownloadPermission"
                  )
                  f-tag(class="rounded-[20px]" @click="copyEmbedAccessCode") 
                    f-svg-icon(iconName="copy_link" size="16" class="text-grey-800")
                f-button(
                  prependIcon="copy_link"
                  size="sm"
                  @click="copyEmbedIFrameCode"
                ) {{ $t('UU0068') }}
            f-infobar(
              :notifyType="NOTIFY_TYPE.WARNING"
              :messageText="$t('FF0071')"
            )
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { shareViaCopyLink, shareViaSocialMedia } from '@/utils/share'
import { copyText } from '@frontier/lib'
import {
  type NodeChild,
  NodeType,
  SocialMedia,
} from '@frontier/platform-web-sdk'
import { useWorkspaceStore } from '@/stores/workspace'
import { NOTIFY_TYPE } from '@frontier/lib'

export interface PropsModalShare {
  node: NodeChild
}

const props = defineProps<PropsModalShare>()

const { t } = useI18n()
const workspaceStore = useWorkspaceStore()
const { ogBaseWorkspaceApi, getWorkspaceNodeShareInfo, nodeShareInfo } =
  workspaceStore
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
const { embed, isCanShared } = toRefs(nodeShareInfo)

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
const openModalShareAssignedPeople = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-share-assigned-people',
    properties: {
      nodeId: nodeId.value,
    },
  })
}

const shareToSocialMedia = async (type: SocialMedia) => {
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
    isEnablePrivateView: embed.value.isEnablePrivateView,
  })

const copyEmbedAccessCode = () => {
  embed.value && copyText(embed.value.accessCode)
  notify.showNotifySnackbar({ messageText: t('RR0149') })
}

const copyEmbedIFrameCode = () => {
  embed.value &&
    copyText(
      `<iframe width="100%" height="100%" src="${window.location.origin}/embed/${embed.value.key}/${nodeId.value}" title="Frontier.cool" frameborder="0"></iframe>`
    )
  notify.showNotifySnackbar({ messageText: t('RR0149') })
}

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
