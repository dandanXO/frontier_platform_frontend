<template lang="pug">
div(class="w-113.5 px-8 relative")
  h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{ $t("RR0079") }}
  div(class="border-b border-black-400")
    div(class="flex gap-x-5")
      div(v-for="tab in tabList" class="cursor-pointer" @click="currentTab = tab.id")
        p(class="pb-2 text-body1 whitespace-nowrap" :class="[tab.id === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600']" ) {{ tab.name }}
  div(class="h-50.5")
    template(v-if="currentTab === TAB.ASSIGNED")
      div(class="py-7.5")
        div(class="flex items-end justify-between pb-6 gap-7")
          div(class="text-body2 text-primary flex flex-col justify-between")
            p(class="font-bold pb-2") {{ $t("RR0156") }}
            p(class="leading-normal") {{ $t("RR0150") }}
          btn(size="sm" class="flex-shrink-0" @click="openModalShareAssigned") {{ $t("UU0067") }}
        div(class="text-body2 text-primary")
          p(class="font-bold pb-2") {{ $t("FF0057") }}
          div(class="flex items-center justify-between")
            div(class="flex items-center")
              avatar-group(
                v-if="shareInfo.shareList.length > 0"
                :avatarList="shareInfo.shareList.map(share => share.logo)"
                class="mr-6"
              )
              p {{ $t("FF0058", { number: shareInfo.shareList.length }) }}
            btn(size="sm" type="secondary" :disabled="shareInfo.shareList.length === 0" @click="openModalShareAssignedList") {{ $t("UU0027") }}
    template(v-else-if="currentTab === TAB.COPY_LINK")
      div(class="py-7.5 h-full flex flex-col justify-between")
        div(class="flex items-center justify-between")
          input-container(:label="$t('FF0063')")
            input-switch(size="30" :name="$t('FF0064')" v-model:inputValue="shareInfo.isCanShared" @update:inputValue="toggleCopyLink")
          btn(size="sm" :disabled="!shareInfo.isCanShared" @click="generateCopyLink") {{ $t("UU0068") }}
        div(class="bg-black-100 h-15 flex px-5 py-3 gap-x-2")
          svg-icon(iconName="error_outline" class="text-primary")
          p(class="text-caption leading-1.6 text-primary") {{ $t("FF0062") }}
    template(v-else-if="currentTab === TAB.SOCIAL_MEDIA")
      div(class="pt-7.5")
        div(class="grid gap-8.5 grid-cols-4 bg-black-100 py-5 px-8 justify-items-center text-primary")
          div(class="cursor-pointer" @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.LINKEDIN)")
            img(src="@/assets/images/linkedin.png")
            p(class="text-caption text-center pt-3") {{ $t("RR0151") }}
          div(class="cursor-pointer" @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.FACEBOOK)")
            img(src="@/assets/images/facebook.png")
            p(class="text-caption text-center pt-3") {{ $t("RR0152") }}
          div(class="cursor-pointer" @click="shareToSocialMedia(SOCIAL_MEDIA_TYPE.TWITTER)")
            img(src="@/assets/images/twitter.png")
            p(class="text-caption text-center pt-3") {{ $t("RR0153") }}
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import AvatarGroup from '@/components/AvatarGroup.vue'
import { SOCIAL_MEDIA_TYPE } from '@/utils/constants.js'
import { shareViaCopyLink, shareViaSocialMedia } from '@/utils/share.js'

export default {
  name: 'ModalShare',
  components: {
    AvatarGroup
  },
  props: {
    workspaceNodeId: {
      type: [String, Number],
      required: true
    },
    nodeType: {
      type: Number,
      required: true
    }
  },
  async setup (props) {
    const { t } = useI18n()
    const store = useStore()

    const TAB = {
      ASSIGNED: 0,
      COPY_LINK: 1,
      SOCIAL_MEDIA: 2,
      EMBED: 3
    }
    const shareInfo = computed(() => store.getters['workspace/shareInfo'])
    const tabList = computed(() => {
      const list = [
        {
          id: TAB.ASSIGNED,
          name: t('FF0051')
        },
        {
          id: TAB.COPY_LINK,
          name: t('RR0154')
        },
        {
          id: TAB.SOCIAL_MEDIA,
          name: t('FF0053')
        }
      ]
      // if (props.nodeType === NODE_TYPE.COLLECTION) {
      //   list.push({
      //     id: TAB.EMBED,
      //     name: t('FF0054')
      //   })
      // }
      return list
    })
    const currentTab = ref(tabList.value[0].id)

    const openModalShareAssigned = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-share-assigned',
        properties: {
          workspaceNodeId: props.workspaceNodeId
        }
      })
    }

    const openModalShareAssignedList = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-share-assigned-list',
        properties: {
          workspaceNodeId: props.workspaceNodeId
        }
      })
    }

    const shareToSocialMedia = async (type) => {
      const sharingKey = await store.dispatch('workspace/generateSocialMedia', { workspaceNodeId: props.workspaceNodeId, type })
      shareViaSocialMedia(sharingKey, type)
    }

    const toggleCopyLink = () => store.dispatch('workspace/toggleCopyLink', { workspaceNodeId: props.workspaceNodeId, isCanShared: shareInfo.value.isCanShared })

    const generateCopyLink = async () => {
      store.dispatch('helper/pushModalLoading')
      const sharingKey = await store.dispatch('workspace/generateCopyLink', { workspaceNodeId: props.workspaceNodeId })
      shareViaCopyLink(sharingKey)
      store.dispatch('helper/closeModalLoading')
      store.commit('helper/PUSH_message', t('RR0149'))
    }

    await store.dispatch('workspace/getShareInfo', { workspaceNodeId: props.workspaceNodeId })

    return {
      tabList,
      currentTab,
      TAB,
      openModalShareAssigned,
      shareInfo,
      openModalShareAssignedList,
      shareToSocialMedia,
      toggleCopyLink,
      generateCopyLink,
      SOCIAL_MEDIA_TYPE
    }
  }
}
</script>
