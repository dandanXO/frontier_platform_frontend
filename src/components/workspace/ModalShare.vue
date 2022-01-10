<template lang="pug">
div(class="w-113.5 px-8")
  h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{$t('RR0079')}}
  div(class="border-b border-black-400")
    div(class="flex gap-x-5")
      div(v-for="tab in tabList" class="cursor-pointer" @click="currentTab = tab.id")
        p(class="pb-2 text-body1 whitespace-nowrap" :class="[tab.id === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600' ]" ) {{tab.name}}
  div(class="h-48")
    template(v-if="currentTab === TAB.ASSIGNED")
      div(class="pt-7.5 pb-10")
        div(class="flex items-end justify-between pb-7.5")
          div(class="text-body2 text-primary flex flex-col justify-between")
            p(class="font-bold pb-2") {{$t('FF0055')}}
            p {{$t('FF0056')}}
          btn(size="sm" @click="openModalShareAssigned") {{$t('UU0067')}}
        div(class="text-body2 text-primary")
          p(class="font-bold pb-2") {{$t('FF0057')}}
          div(class="flex items-center justify-between")
            div(class="flex items-center")
              avatar-group(
                v-if="shareInfo.shareList.length > 0"
                :avatarList="shareInfo.shareList.map(share => share.logo)"
                class="mr-6"
              )
              p {{$t('FF0058', { number: shareInfo.shareList.length })}}
            btn(size="sm" type="secondary" :disabled="shareInfo.shareList.length === 0" @click="openModalShareAssignedList") {{$t('UU0027')}}
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import AvatarGroup from '@/components/AvatarGroup.vue'
import { NODE_TYPE } from '@/utils/constants.js'

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
          name: t('FF0052')
        },
        {
          id: TAB.SOCIAL_MEDIA,
          name: t('FF0053')
        }
      ]
      if (props.nodeType === NODE_TYPE.COLLECTION) {
        list.push({
          id: TAB.EMBED,
          name: t('FF0054')
        })
      }
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

    await store.dispatch('workspace/getShareInfo', { workspaceNodeId: props.workspaceNodeId })

    return {
      tabList,
      currentTab,
      TAB,
      openModalShareAssigned,
      shareInfo,
      openModalShareAssignedList
    }
  }
}
</script>
