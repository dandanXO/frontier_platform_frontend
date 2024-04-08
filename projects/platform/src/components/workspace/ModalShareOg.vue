<template lang="pug">
modal-behavior(
  :header="$t('RR0344')"
  :primaryBtnText="$t('UU0146')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="ogShareList.length === 0 || !isDirty"
  @click:primary="assignedShare"
  @click:secondary="closeModal"
)
  template(#note)
    div(class="flex items-center gap-x-1.5")
      f-svg-icon(iconName="info_outline" class="text-grey-600" size="14")
      p(class="text-grey-600 text-caption") {{ $t('FF0077') }}
  div(class="w-164")
    share-input-list(
      :type="SHARE_WITH_TYPE.OG"
      :inputShareList="ogShareList"
      @addNew="addNewTarget($event)"
      :placeholder="$t('FF0076')"
      :callbackGetTarget="getTarget"
    )
      template(#default="{ item, index }")
        f-avatar(type="org" :imageUrl="item.unitLogo" size="md")
        p(class="text-body2 flex-grow text-grey-900 line-clamp-1") {{ item.unitName }}
        div(class="flex items-center gap-x-5")
          f-select-dropdown(
            :selectValue="item.permission"
            :dropdownMenuTree="permissionMenuTree"
            @update:selectValue="updatePermission(index, $event)"
            size="sm"
          )
          f-svg-icon(
            @click="openModalShareAssignedMessage(index)"
            :iconName="item.message ? 'chat' : 'none_chat'"
            size="24"
            class="text-grey-600 hover:text-primary-400 cursor-pointer"
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
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import ShareInputList from '@/components/common/ShareInputList.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import type { ShareOGTarget, ShareItemInfo } from '@frontier/platform-web-sdk'
import { SharePermission } from '@frontier/platform-web-sdk'
import { SHARE_WITH_TYPE } from '@/utils/constants'

type ShareOGItem = ShareOGTarget &
  ShareItemInfo & {
    isDeleted: boolean
    isUpdated: boolean
    isNew: boolean
  }

const props = defineProps<{
  nodeId: number
}>()

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const {
  ogBaseWorkspaceApi,
  nodeShareInfo,
  shareWorkspaceNodeShareAddPeopleOG,
} = useWorkspaceStore()
const ogShareList = ref<ShareOGItem[]>(
  (nodeShareInfo?.ogShareList?.map((item) => ({
    ...item,
    isDeleted: false,
    isUpdated: false,
    isNew: false,
  })) as ShareOGItem[]) ?? []
)
const isDirty = computed(() => {
  return ogShareList.value.some(
    (item) => item.isDeleted || item.isNew || item.isUpdated
  )
})

const getTarget = async (targetNumber: string) => {
  const { data } = await ogBaseWorkspaceApi(
    'getWorkspaceNodeShareAddPeopleOGGetTarget',
    {
      nodeId: props.nodeId,
      ogNo: targetNumber,
    }
  )
  return data.result.target
}

const addNewTarget = (newTarget: ShareOGTarget) => {
  ogShareList.value.push({
    ...newTarget,
    id: -1,
    permission: SharePermission.VIEW_ONLY,
    message: '',
    isNew: true,
    isDeleted: false,
    isUpdated: false,
  })
}
const updatePermission = (index: number, value: SharePermission) => {
  ogShareList.value[index].permission = value
  ogShareList.value[index].isUpdated = true
}
const deleteShare = (index: number) => {
  ogShareList.value[index].isDeleted = true
}
const undoDeleteShare = (index: number) => {
  ogShareList.value[index].isDeleted = false
}

const updateMessage = (index: number, message: string) => {
  ogShareList.value[index].message = message
  ogShareList.value[index].isUpdated = true
}

const openModalShareAssignedMessage = (index: number) => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-share-assigned-message',
    properties: {
      message: ogShareList.value[index].message,
      onUpdateMessage: (message: string) => {
        updateMessage(index, message)
      },
    },
  })
}

const assignedShare = async () => {
  store.dispatch('helper/pushModalLoading')
  await shareWorkspaceNodeShareAddPeopleOG({
    nodeId: props.nodeId,
    addList: ogShareList.value.filter((item) => item.isNew && !item.isDeleted),
    updateList: ogShareList.value.filter(
      (item) => !item.isNew && item.isUpdated && !item.isDeleted
    ),
    removeList: ogShareList.value.filter(
      (item) => !item.isNew && item.isDeleted
    ),
  })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModal')
  notify.showNotifySnackbar({ messageText: t('RR0157') })
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

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
