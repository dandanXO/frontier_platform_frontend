<template lang="pug">
modal-behavior(
  :header="$t('FF0057')"
  :primaryBtnText="$t('UU0018')"
  :textBtnText="$t('UU0026')"
  @click:primary="updateAssignedShare"
  @click:text="closeModal"
)
  div(class="w-114.5")
    f-scrollbar-container(class="h-100.5 -mx-5 px-5")
      div(class="grid gap-y-7.5")
        div(
          v-for="item in extendedShareList"
          :key="item.number"
          class="flex items-center justify-between h-10.5"
        )
          div(class="flex items-center gap-x-2.5")
            img(
              v-if="item.unitLogo"
              :src="item.unitLogo"
              class="w-10 h-10 rounded-full"
            )
            div(
              v-else
              class="w-10 h-10 rounded-full border-grey-250 border border-dashed"
            )
            div(class="w-86")
              p(
                class="text-body2 font-bold w-86 line-clamp-1 mb-2"
                :class="[item.isRemove ? 'text-grey-250' : 'text-grey-900']"
              ) {{ item.unitName }}
              div(class="flex items-center gap-x-3")
                f-input-checkbox(
                  binary
                  v-model:inputValue="item.isCanDownloadU3M"
                  :label="$t('FF0033')"
                  iconSize="20"
                  :disabled="item.isRemove"
                  @update:inputValue="addToUpdateList(item)"
                )
                f-input-checkbox(
                  binary
                  v-model:inputValue="item.isCanClone"
                  :label="$t('FF0034')"
                  iconSize="20"
                  :disabled="item.isRemove"
                  @update:inputValue="addToUpdateList(item)"
                )
          div
            p(
              v-if="item.isRemove"
              class="text-body2 text-primary-400 cursor-pointer"
              @click="item.isRemove = false"
            ) {{ $t('UU0113') }}
            p(
              v-else
              class="text-body2 text-grey-250 cursor-pointer"
              @click="item.isRemove = true"
            ) {{ $t('FF0060') }}
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { reactive } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  nodeId: number
}>()

const workspaceStore = useWorkspaceStore()
const { ogBaseWorkspaceApi, getWorkspaceNodeShareInfo } = workspaceStore
const { shareList } = storeToRefs(workspaceStore)
const store = useStore()
const extendedShareList = reactive(
  shareList.value.map((item) => {
    return { ...item, isRemove: false }
  })
)

const updateList = reactive<typeof extendedShareList>([])
const addToUpdateList = (item: typeof extendedShareList[0]) => {
  const existIndex = updateList.findIndex((listItem) => listItem.id === item.id)
  if (existIndex !== -1) {
    updateList[existIndex] = item
  } else {
    updateList.push(item)
  }
}

const updateAssignedShare = async () => {
  const removeList = extendedShareList.filter((item) => item.isRemove)
  if (updateList.length === 0 && removeList.length === 0) {
    closeModal()
    return
  }
  store.dispatch('helper/pushModalLoading')
  await ogBaseWorkspaceApi('updateWorkspaceNodeShareAssigned', {
    nodeId: props.nodeId,
    updateList,
    removeList,
  })
  await getWorkspaceNodeShareInfo(props.nodeId)
  store.dispatch('helper/closeModalLoading')
  closeModal()
}

const closeModal = () => {
  store.dispatch('helper/closeModal')
}
</script>
