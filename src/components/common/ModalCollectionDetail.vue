<template lang="pug">
div(class="w-161.5")
  div(class="border-t border-b border-black-400 px-8")
    div(class="my-5 w-97.5 h-69 mx-auto bg-black-200 flex items-center justify-center")
      a(v-if="trendBoardCoverImg" :href="trendBoardUrl" target="_blank" class="w-full h-full")
        img(:src="trendBoardCoverImg" class="w-full h-full object-contain")
      p(v-else class="text-body2 text-black-400") {{ $t("FF0007") }}
    div(class="pb-5" class="text-body2 text-primary leading-1.6")
      overlay-scrollbar-container(v-if="description" class="max-h-27.5") {{ description }}
      p(v-else class="text-center") {{ $t("FF0008") }}
  btn-group(
    v-if="canEdit"
    class="h-25"
    :primaryText="$t('UU0027')"
    @click:primary="goToEditCollection"
    :secondaryText="$t('UU0002')"
    @click:secondary="closeModal"
  )
  btn-group(
    v-else
    class="h-25"
    :primaryText="$t('UU0026')"
    @click:primary="closeModal"
    :secondaryButton="false"
  )
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'ModalCollectionDetail',
  props: {
    workspaceNodeId: {
      type: Number,
      required: true
    },
    trendBoardCoverImg: {
      required: true
    },
    trendBoardUrl: {
      required: true
    },
    description: {
      required: true
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const store = useStore()

    const goToEditCollection = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-create-or-edit-collection',
        properties: {
          mode: 2,
          workspaceNodeId: props.workspaceNodeId
        }
      })
    }

    const closeModal = () => (store.dispatch('helper/closeModal'))

    return {
      closeModal,
      goToEditCollection
    }
  }
}
</script>
