<template lang="pug">
modal-behavior(
  :header="$t('FF0057')"
  :primaryBtnText="$t('UU0018')"
  :textBtnText="$t('UU0026')"
  @click:primary="updateAssignedShare"
  @click:text="closeModal"
)
  f-scrollbar-container(class="h-100.5 -mx-5 px-5")
    div(class="grid gap-y-7.5 w-114.5")
      div(v-for="item in copyShareList" class="flex items-center justify-between h-10.5")
        div(class="flex items-center gap-x-2.5")
          img(v-if="item.logo" :src="item.logo" class="w-10 h-10 rounded-full")
          div(v-else class="w-10 h-10 rounded-full border-grey-200 border border-dashed")
          div(class="w-86")
            p(class="text-body2 font-bold w-86 line-clamp-1 mb-2" :class="[item.isRemove ? 'text-grey-200' : 'text-grey-900']") {{ item.name }}
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
          p(v-if="item.isRemove" class="text-body2 text-primary-400 cursor-pointer" @click="item.isRemove = false") {{ $t('UU0113') }}
          p(v-else class="text-body2 text-grey-200 cursor-pointer" @click="item.isRemove = true") {{ $t('FF0060') }}
</template>

<script setup>
import { useStore } from 'vuex'
import { reactive, computed } from 'vue'

const props = defineProps({
  workspaceNodeId: {
    type: [String, Number],
    required: true
  }
})

const store = useStore()
const shareList = computed(() => store.getters['workspace/shareInfo'].shareList)
const copyShareList = reactive(shareList.value.map(item => {
  return { ...item, isRemove: false }
}))

const updateList = reactive([])
const addToUpdateList = (item) => {
  const existIndex = updateList.findIndex(listItem => listItem.id === item.id)
  if (existIndex !== -1) {
    updateList[existIndex] = item
  } else {
    updateList.push(item)
  }
}

const updateAssignedShare = async () => {
  const removeList = copyShareList.filter(item => item.isRemove)
  if (updateList.length === 0 && removeList.length === 0) {
    closeModal()
    return
  }
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('workspace/updateAssignedShare', { updateList, removeList })
  await store.dispatch('workspace/getShareInfo', { workspaceNodeId: props.workspaceNodeId })
  store.dispatch('helper/closeModalLoading')
  closeModal()
}

const closeModal = () => {
  store.dispatch('helper/closeModal')
}
</script>
