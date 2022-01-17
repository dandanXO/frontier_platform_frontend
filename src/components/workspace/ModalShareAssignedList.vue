<template lang="pug">
div(class="w-fix px-8")
  h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{$t('FF0057')}}
  overlay-scrollbar-container(class="max-h-100.5 mb-7.5 -mx-8 px-8")
    div(class="grid gap-y-7.5")
      div(v-for="item in shareList" class="flex items-center h-10.5 gap-x-2.5")
        img(v-if="item.logo" :src="item.logo" class="w-10 h-10 rounded-full")
        div(v-else class="w-10 h-10 rounded-full border-black-500 border border-dashed")
        div(class="flex-grow")
          p(class="text-body2 text-primary font-bold line-clamp-1") {{item.name}}
          div(class="flex items-center gap-x-3")
            input-checkbox(
              binary
              v-model:inputValue="item.isCanDownloadU3M"
              :label="$t('FF0033')"
              size="20"
              @update:inputValue="updatedAssignedShare(item)"
            )
            input-checkbox(
              binary
              v-model:inputValue="item.isCanClone"
              :label="$t('FF0034')"
              size="20"
              @update:inputValue="updatedAssignedShare(item)"
            )
        p(class="text-body2 text-black-500 cursor-pointer" @click="removeAssignedShare(item)") {{$t('FF0060')}}
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'ModalShareAssignedList',
  props: {
    workspaceNodeId: {
      type: [String, Number],
      required: true
    }
  },
  setup (props) {
    const store = useStore()

    const shareList = computed(() => store.getters['workspace/shareInfo'].shareList)

    const updatedAssignedShare = async (item) => {
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('workspace/updatedAssignedShare', {
        workspaceNodeId: props.workspaceNodeId,
        ...item
      })
      store.dispatch('helper/closeModalLoading')
    }

    const removeAssignedShare = async (item) => {
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('workspace/removeAssignedShare', {
        workspaceNodeId: props.workspaceNodeId,
        ...item
      })
      store.dispatch('helper/closeModalLoading')

      if (shareList.value.length === 0) {
        store.dispatch('helper/closeModal')
      }
    }

    return {
      shareList,
      updatedAssignedShare,
      removeAssignedShare
    }
  }
}
</script>
