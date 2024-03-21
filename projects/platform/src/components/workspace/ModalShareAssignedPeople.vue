<template lang="pug">
modal-behavior(
  :header="$t('RR0155')"
  :primaryBtnText="$t('UU0146')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="(openShareList.length === 0 && privateShareList.length === 0) || !isDirty"
  @click:primary="assignedShare"
  @click:secondary="closeModal"
)
  div(class="w-164")
    f-tabs(:tabList="tabList" keyField="id")
      template(#default="{ currentTab }")
        div(class="pt-5")
          share-assigned-people(
            v-if="currentTab === TAB.OPEN"
            :nodeId="nodeId"
            v-model:shareList="openShareList"
            :isPrivate="false"
          )
          share-assigned-people(
            v-else-if="currentTab === TAB.PRIVATE"
            :nodeId="nodeId"
            v-model:shareList="privateShareList"
            isPrivate
          )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import type {
  ShareEmailTarget,
  ShareItemInfo,
} from '@frontier/platform-web-sdk'
import { useWorkspaceStore } from '@/stores/workspace'
import ShareAssignedPeople from '@/components/workspace/ShareAssignedPeople.vue'

type ShareUserItem = ShareEmailTarget &
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
const { nodeShareInfo, shareWorkspaceNodeShareAddPeopleEmail } =
  useWorkspaceStore()

const TAB = {
  OPEN: 0,
  PRIVATE: 1,
}

const tabList = computed(() => {
  const list = [
    {
      id: TAB.OPEN,
      name: t('FF0087'),
    },
    {
      id: TAB.PRIVATE,
      name: t('FF0088'),
    },
  ]
  return list
})

const openShareList = ref<ShareUserItem[]>(
  (nodeShareInfo?.emailShare?.openShareList?.map((item) => ({
    ...item,
    isDeleted: false,
    isUpdated: false,
    isNew: false,
    hasResent: false,
  })) as ShareUserItem[]) ?? []
)
const privateShareList = ref<ShareUserItem[]>(
  (nodeShareInfo?.emailShare?.privateShareList?.map((item) => ({
    ...item,
    isDeleted: false,
    isUpdated: false,
    isNew: false,
    hasResent: false,
  })) as ShareUserItem[]) ?? []
)

const isDirty = computed(() => {
  return (
    openShareList.value.some(
      (item) => item.isDeleted || item.isNew || item.isUpdated
    ) ||
    privateShareList.value.some(
      (item) => item.isDeleted || item.isNew || item.isUpdated
    )
  )
})

const assignedShare = async () => {
  store.dispatch('helper/pushModalLoading')
  await shareWorkspaceNodeShareAddPeopleEmail({
    nodeId: props.nodeId,
    openShare: {
      addList: openShareList.value.filter(
        (item) => item.isNew && !item.isDeleted
      ),
      updateList: openShareList.value.filter(
        (item) => !item.isNew && item.isUpdated && !item.isDeleted
      ),
      removeList: openShareList.value.filter(
        (item) => !item.isNew && item.isDeleted
      ),
    },
    privateShare: {
      addList: privateShareList.value.filter(
        (item) => item.isNew && !item.isDeleted
      ),
      updateList: privateShareList.value.filter(
        (item) => !item.isNew && item.isUpdated && !item.isDeleted
      ),
      removeList: privateShareList.value.filter(
        (item) => !item.isNew && item.isDeleted
      ),
    },
  })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModal')
  const isEdit =
    openShareList.value.some((item) => item.isDeleted || item.isUpdated) ||
    privateShareList.value.some((item) => item.isDeleted || item.isUpdated)
  notify.showNotifySnackbar({ messageText: isEdit ? t('FF0084') : t('RR0157') })
}

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
