<template lang="pug">
modal-behavior(
  :header="$t('RR0155')"
  :primaryBtnText="$t('UU0146')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="privateShareList.length === 0 || !isDirty"
  @click:primary="assignedShare"
  @click:secondary="closeModal"
)
  div(class="w-164")
    share-input-list(
      :type="SHARE_WITH_TYPE.USER"
      :inputShareList="privateShareList"
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
        f-input-switch(
          iconSize="30"
          :label="$t('FF0033')"
          :inputValue="item.isCanDownloadU3M"
          @update:inputValue="updatePermission(index, $event)"
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
import { useWorkspaceStore } from '@/stores/workspace'
import ShareInputList from '@/components/common/ShareInputList.vue'
import type {
  ShareEmailTarget,
  ShareEmbedItemInfo,
} from '@frontier/platform-web-sdk'
import { SHARE_WITH_TYPE } from '@/utils/constants'

const props = defineProps<{
  nodeId: number
}>()

export type ShareUserItem = ShareEmailTarget &
  ShareEmbedItemInfo & {
    isDeleted: boolean
    isUpdated: boolean
    isNew: boolean
  }

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { ogBaseWorkspaceApi, nodeShareInfo, shareWorkspaceNodeEmbedEmail } =
  useWorkspaceStore()

const privateShareList = ref<ShareUserItem[]>(
  (nodeShareInfo?.embed?.privateShareList?.map((item) => ({
    ...item,
    isDeleted: false,
    isUpdated: false,
    isNew: false,
  })) as ShareUserItem[]) ?? []
)

const getTarget = async (targetNumber: string) => {
  const { data } = await ogBaseWorkspaceApi(
    'getWorkspaceNodeShareEmbedEmailGetTarget',
    {
      nodeId: props.nodeId,
      email: targetNumber,
    }
  )
  return data.result.target
}

const addNewTarget = (newTarget: ShareEmailTarget) => {
  privateShareList.value.push({
    ...newTarget,
    id: -1,
    isNew: true,
    isDeleted: false,
    isUpdated: false,
    isCanDownloadU3M: false,
  })
}

const deleteShare = (index: number) => {
  privateShareList.value[index].isDeleted = true
}
const undoDeleteShare = (index: number) => {
  privateShareList.value[index].isDeleted = false
}
const updatePermission = (index: number, isCanDownloadU3M: boolean) => {
  privateShareList.value[index].isCanDownloadU3M = isCanDownloadU3M
  privateShareList.value[index].isUpdated = true
}

const isDirty = computed(() => {
  return privateShareList.value.some(
    (item) => item.isDeleted || item.isNew || item.isUpdated
  )
})

const assignedShare = async () => {
  store.dispatch('helper/pushModalLoading')
  await shareWorkspaceNodeEmbedEmail({
    nodeId: props.nodeId,
    addList: privateShareList.value.filter(
      (item) => item.isNew && !item.isDeleted
    ),
    updateList: privateShareList.value.filter(
      (item) => !item.isNew && item.isUpdated && !item.isDeleted
    ),
    removeList: privateShareList.value.filter(
      (item) => !item.isNew && item.isDeleted
    ),
  })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModal')
  const isEdit = privateShareList.value.some(
    (item) => item.isDeleted || item.isUpdated
  )
  notify.showNotifySnackbar({ messageText: isEdit ? t('FF0084') : t('RR0157') })
}

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
