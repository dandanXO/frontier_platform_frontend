<template lang="pug">
modal-behavior(
  :header="$t('RR0246')"
  :primaryBtnText="canEdit ? $t('UU0027') : ''"
  :secondaryBtnText="canEdit ? $t('UU0002') : $t('UU0026')"
  @click:primary="canEdit ? goToEditCollection() : closeModal()"
  @click:secondary="closeModal"
)
  div(class="w-151.5 h-52.5 flex justify-between")
    div(class="w-94.5 flex flex-col")
      p(class="font-bold text-grey-900 leading-1.6 pb-4") {{ $t('RR0014') }}
      f-scrollbar-container(v-if="description" class="flex-grow -ml-6.5 px-6.5 break-all text-body2 text-grey-900 leading-1.6") {{ description }}
      p(v-else class="text-body2 text-grey-900 leading-1.6") {{ $t("FF0008") }}
    div(class="w-44 flex flex-col")
      p(class="font-bold text-grey-900 leading-1.6 pb-4") {{ $t('RR0249') }}
      a(v-if="trendBoardCoverImg" :href="trendBoardUrl" target="_blank"  class="flex-grow flex flex-col bg-grey-200 rounded overflow-hidden")
        div(class="h-32.5 relative")
          img(:src="trendBoardCoverImg" class="w-full h-full object-contain")
          f-svg-icon(iconName="open_in_new" size="24" class="text-grey-0 absolute top-1 left-1")
        div(class="flex-grow bg-grey-50 flex items-center justify-center")
          p(class="text-caption text-grey-900 w-37.5 line-clamp-1 !break-all") {{ trendBoardDisplayFileName }}
      div(v-else class="flex-grow flex flex-col rounded overflow-hidden")
        div(class="h-32.5 bg-grey-200 flex items-center justify-center")
          f-svg-icon(iconName="file" size="50" class="text-grey-0")
        div(class="flex-grow bg-grey-50 flex items-center justify-center")
          p(class="text-caption text-grey-200") {{ $t("RR0247") }}
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
  trendBoardDisplayFileName: {
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
