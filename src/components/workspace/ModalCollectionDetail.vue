<template lang="pug">
div(class="w-161.5")
  div(class="border-t border-b border-black-400 px-8")
    div(class="my-5 w-97.5 h-69 mx-auto bg-black-200 flex items-center justify-center")
      a(v-if="workspaceCollection.trendBoardCoverImg" :href="workspaceCollection.trendBoardUrl" target="_blank" class="w-full h-full")
        img(:src="workspaceCollection.trendBoardCoverImg" class="w-full h-full object-contain")
      p(v-else class="text-body2 text-black-400") {{$t('FF0007')}}
    div(class="pb-5" class="text-body2 text-primary line-height-1.6")
      overlay-scrollbar-container(v-if="workspaceCollection.description" class="max-h-27.5") {{workspaceCollection.description}}
      p(v-else class="text-center") {{$t('FF0008')}}
  btn-group(
    class="h-25"
    :primaryText="$t('UU0027')"
    @click:primary="goToEditCollection"
    :secondaryText="$t('UU0002')"
    @click:secondary="closeModal"
  )
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
  name: 'ModalCollectionDetail',
  setup () {
    const store = useStore()
    const workspaceCollection = computed(() => store.getters['workspace/workspaceCollection'])

    const goToEditCollection = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-create-or-edit-collection',
        properties: {
          mode: 2,
          workspaceNodeId: workspaceCollection.value.workspaceNodeId
        }
      })
    }

    const closeModal = () => (store.dispatch('helper/closeModal'))

    return {
      workspaceCollection,
      closeModal,
      goToEditCollection
    }
  }
}
</script>
