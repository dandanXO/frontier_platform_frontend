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
                  @click="openModalPublicLibraryShareAssigned(SHARE_WITH_TYPE.OG)"
                ) {{ $t('UU0144') }}
            div(class="text-body2 text-grey-900 flex flex-col justify-between")
              p(class="font-bold pb-2") {{ $t('RR0155') }}
              div(class="flex items-end justify-between")
                p(class="leading-normal") {{ $t('FF0089') }}
                f-button(
                  size="sm"
                  class="flex-shrink-0"
                  prependIcon="person_add"
                  @click="openModalPublicLibraryShareAssigned(SHARE_WITH_TYPE.USER)"
                ) {{ $t('UU0145') }}
        template(v-else-if="currentTab === TAB.SOCIAL_MEDIA")
          div(
            class="grid gap-10 grid-cols-4 bg-grey-50 py-5 px-10 justify-items-center text-grey-900"
          )
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
            div(
              :class="[isCanShared ? 'cursor-pointer' : '']"
              @click="generateCopyLink"
            )
              div(
                class="w-16 h-16 flex justify-center items-center bg-primary-400 rounded-full"
              )
                f-svg-icon(
                  iconName="copy_link"
                  size="40"
                  class="text-grey-0"
                  :class="{ 'text-grey-250': !isCanShared }"
                )
              p(
                class="text-caption text-center pt-3"
                :class="{ 'text-grey-250': !isCanShared }"
              ) {{ $t('RR0154') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { shareViaCopyLink, shareViaSocialMedia } from '@/utils/share'
import { type NodeChild, SocialMedia } from '@frontier/platform-web-sdk'
import { usePublicLibraryStore } from '@/stores/publicLibrary'
import { computed } from 'vue'
import { SHARE_WITH_TYPE } from '@/utils/constants'

export interface PropsModalPublicLibraryShare {
  node: NodeChild
}

const props = defineProps<PropsModalPublicLibraryShare>()

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { ogBasePublicLibraryApi } = usePublicLibraryStore()

const isCanShared = computed(() => props.node.nodeMeta.isCanShared)

const TAB = {
  ASSIGNED: 0,
  SOCIAL_MEDIA: 2,
}
const tabList = computed(() => {
  const list = [
    {
      id: TAB.ASSIGNED,
      name: t('FF0051'),
    },
    {
      id: TAB.SOCIAL_MEDIA,
      name: t('FF0053'),
    },
  ]
  return list
})

const shareToSocialMedia = async (type: SocialMedia) => {
  const { data } = await ogBasePublicLibraryApi(
    'generatePublicLibraryNodeShareSocial',
    {
      nodeId: props.node.nodeMeta.nodeId,
      type,
    }
  )
  shareViaSocialMedia(data.result.key, type)
}

const generateCopyLink = async () => {
  if (!isCanShared.value) {
    return
  }

  store.dispatch('helper/pushModalLoading')
  const { data } = await ogBasePublicLibraryApi(
    'generatePublicLibraryNodeShareCopyLink',
    {
      nodeId: props.node.nodeMeta.nodeId,
    }
  )
  shareViaCopyLink(data.result.key)
  store.dispatch('helper/closeModalLoading')
  notify.showNotifySnackbar({ messageText: t('RR0149') })
}

const openModalPublicLibraryShareAssigned = (type: SHARE_WITH_TYPE) => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-public-library-share-assigned',
    properties: {
      nodeId: props.node.nodeMeta.nodeId,
      type,
    },
  })
}

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
