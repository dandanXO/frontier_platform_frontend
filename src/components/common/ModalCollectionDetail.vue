<template lang="pug">
modal-behavior(
  :header="$t('FF0006')"
  :primaryBtnText="canEdit ? $t('UU0027') : ''"
  :secondaryBtnText="canEdit ? $t('UU0002') : $t('UU0026')"
  @click:primary="canEdit ? goToEditCollection() : closeModal()"
  @click:secondary="closeModal"
)
  div(class="w-150")
    div(class="mb-5 w-97.5 h-69 mx-auto bg-black-200 flex items-center justify-center")
      a(v-if="trendBoardCoverImg" :href="trendBoardUrl" target="_blank" class="w-full h-full")
        img(:src="trendBoardCoverImg" class="w-full h-full object-contain")
      p(v-else class="text-body2 text-black-400") {{ $t("FF0007") }}
    div(class="text-body2 text-primary leading-1.6")
      overlay-scrollbar-container(v-if="description" class="max-h-27.5 -mx-5 px-5") {{ description }}
      p(v-else class="text-center") {{ $t("FF0008") }}
</template>

<script setup>
import { useStore } from 'vuex'

const props = defineProps({
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
})

const store = useStore()

const goToEditCollection = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-collection',
    properties: {
      mode: 2,
      workspaceNodeId: props.workspaceNodeId
    }
  })
}

const closeModal = () => store.dispatch('helper/closeModal')
</script>
