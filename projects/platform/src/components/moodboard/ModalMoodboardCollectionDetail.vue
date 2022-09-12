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
      p(class="font-bold text-primary leading-1.6 pb-4") {{ $t('RR0014') }}
      f-scrollbar-container(v-if="description" class="flex-grow -ml-3 px-3 break-all text-body2 text-primary leading-1.6") {{ description }}
      p(v-else class="text-body2 text-primary leading-1.6") {{ $t("FF0008") }}
    div(class="w-44.5 flex flex-col")
      p(class="font-bold text-primary leading-1.6 pb-4") {{ $t('RR0249') }}
      a(v-if="trendBoardCoverImg" :href="trendBoardUrl" target="_blank"  class="flex-grow flex flex-col bg-black-400 rounded overflow-hidden")
        div(class="h-32.5 relative")
          img(:src="trendBoardCoverImg" class="w-full h-full object-contain")
          f-svg-icon(iconName="open_in_new" size="24" class="text-black-0 absolute top-1 left-1")
        div(class="flex-grow bg-black-100 flex items-center justify-center")
          p(class="text-caption text-primary w-37.5 line-clamp-1 !break-all") {{ trendBoardFileName }}
      div(v-else class="flex-grow flex flex-col rounded overflow-hidden")
        div(class="h-32.5 bg-black-400 flex items-center justify-center")
          f-svg-icon(iconName="folder_Large" size="50" class="text-black-0")
        div(class="flex-grow bg-black-50 flex items-center justify-center")
          p(class="text-caption text-black-400") {{ $t("RR0247") }}
</template>

<script setup>
import { useStore } from 'vuex'
import { CREATE_EDIT } from '@/utils/constants.js'

const props = defineProps({
  nodeId: {
    type: Number,
    required: true
  },
  trendBoardCoverImg: {
    required: true
  },
  trendBoardUrl: {
    required: true
  },
  trendBoardFileName: {
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
    component: 'modal-create-or-edit-moodboard-collection',
    properties: {
      mode: CREATE_EDIT.EDIT,
      nodeId: props.nodeId
    }
  })
}

const closeModal = () => store.dispatch('helper/closeModal')
</script>
