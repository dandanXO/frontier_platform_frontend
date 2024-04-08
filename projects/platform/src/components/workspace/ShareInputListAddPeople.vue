<template lang="pug">
share-input-list(
  :type="SHARE_WITH_TYPE.USER"
  :inputShareList="innerShareList"
  @addNew="addNewTarget($event)"
  :placeholder="$t('RR0350')"
  :callbackGetTarget="getTarget"
)
  template(#default="{ item, index }")
    f-avatar(
      v-if="item.isFrontierUser"
      type="user"
      :imageUrl="item.avatar"
      size="md"
      :class="{ 'opacity-30': item.isDeleted }"
    ) 
    div(
      v-else
      class="w-8 h-8 rounded-full border-grey-900 border border-dashed"
      :class="{ 'opacity-30': item.isDeleted }"
    )
    p(
      class="text-body2 flex-grow line-clamp-2"
      :class="[item.isDeleted ? 'text-grey-250' : 'text-grey-900']"
    ) {{ item.email }}
    div(class="flex items-center gap-x-5")
      f-select-dropdown(
        :selectValue="item.permission"
        :dropdownMenuTree="permissionMenuTree"
        @update:selectValue="updatePermission(index, $event)"
        :disabled="item.isDeleted"
        size="sm"
      )
      f-svg-icon(
        @click="openModalShareAssignedMessage(index)"
        :iconName="item.message ? 'chat' : 'none_chat'"
        size="24"
        :class="[item.isDeleted ? 'text-grey-250 pointer-events-none' : 'text-grey-600 hover:text-primary-400 cursor-pointer']"
      )
      f-svg-icon(
        @click="resend(index)"
        iconName="forward_to_mail"
        size="24"
        :class="[item.hasResent ? 'text-grey-250 pointer-events-none' : 'text-grey-600 hover:text-primary-400 cursor-pointer']"
      )
    f-svg-icon(
      v-if="!item.isDeleted"
      iconName="close"
      size="24"
      class="text-grey-600 hover:text-primary-400 cursor-pointer"
      @click="deleteShare(index)"
    )
    f-svg-icon(
      v-else
      iconName="undo"
      size="24"
      class="text-primary-400 cursor-pointer"
      @click="undoDeleteShare(index)"
    )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import ShareInputList from '@/components/common/ShareInputList.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { useNotifyStore } from '@/stores/notify'
import type {
  ShareItemInfo,
  ShareEmailTarget,
} from '@frontier/platform-web-sdk'
import { SharePermission } from '@frontier/platform-web-sdk'
import { SHARE_WITH_TYPE } from '@/utils/constants'

export type ShareUserItem = ShareEmailTarget &
  ShareItemInfo & {
    isDeleted: boolean
    isUpdated: boolean
    isNew: boolean
    hasResent: boolean
  }

const props = defineProps<{
  nodeId: number
  shareList: ShareUserItem[]
  isPrivate: boolean
}>()
const emit = defineEmits<{
  (e: 'update:shareList', v: ShareUserItem[]): void
}>()

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { ogBaseWorkspaceApi } = useWorkspaceStore()

const innerShareList = computed({
  get: () => props.shareList,
  set: (v) => emit('update:shareList', v),
})

const getTarget = async (targetNumber: string) => {
  const { data } = await ogBaseWorkspaceApi(
    'getWorkspaceNodeShareAddPeopleEmailGetTarget',
    {
      nodeId: props.nodeId,
      email: targetNumber,
      isPrivate: props.isPrivate,
    }
  )
  return data.result.target
}

const addNewTarget = (newTarget: ShareEmailTarget) => {
  innerShareList.value.push({
    ...newTarget,
    id: -1,
    permission: SharePermission.VIEW_ONLY,
    message: '',
    isNew: true,
    isDeleted: false,
    isUpdated: false,
    hasResent: false,
  })
}
const updatePermission = (index: number, value: SharePermission) => {
  innerShareList.value[index].permission = value
  innerShareList.value[index].isUpdated = true
}
const deleteShare = (index: number) => {
  innerShareList.value[index].isDeleted = true
}
const undoDeleteShare = (index: number) => {
  innerShareList.value[index].isDeleted = false
}

const updateMessage = (index: number, message: string) => {
  innerShareList.value[index].message = message
  innerShareList.value[index].isUpdated = true
}

const resend = (index: number) => {
  innerShareList.value[index].hasResent = true
  ogBaseWorkspaceApi('resendWorkspaceNodeShareAddPeopleEmail', {
    id: innerShareList.value[index].id,
  })
  notify.showNotifySnackbar({ messageText: t('FF0085') })
}

const openModalShareAssignedMessage = (index: number) => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-share-assigned-message',
    properties: {
      message: innerShareList.value[index].message,
      onUpdateMessage: (message: string) => {
        updateMessage(index, message)
      },
    },
  })
}

const permissionMenuTree = computed(() => {
  const SharePermissionText = {
    [SharePermission.VIEW_ONLY]: {
      title: t('FF0078'),
      description: t('FF0079'),
    },
    [SharePermission.IS_CAN_DOWNLOAD_U3M]: {
      title: t('TT0038'),
      description: t('FF0080'),
    },
    [SharePermission.IS_CAN_CLONE]: {
      title: t('TT0039'),
      description: t('FF0081'),
    },
    [SharePermission.ALL_ALLOW]: {
      title: t('FF0082'),
      description: t('FF0083'),
    },
  }
  return {
    width: 'w-66',
    blockList: [
      {
        menuList: Object.values(SharePermission).map((p) => ({
          title: SharePermissionText[p].title,
          selectValue: p,
          display: 'block',
          description: SharePermissionText[p].description,
          descriptionLineClamp: 2,
        })),
      },
    ],
  }
})
</script>
