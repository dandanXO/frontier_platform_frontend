<template lang="pug">
div(class="fixed inset-0 z-index:modal pt-16 w-screen h-screen bg-black-0")
  fullscreen-header(
    :title="$t('EE0006')"
    :primaryText="$t('UU0003')"
    @click:primary="goToAssetsMaterialMergePreview"
    @click:secondary="goToAssets"
  )
  div(class="flex flex-col h-full")
    div(class="min-h-71.5 bg-black-0")
      overlay-scrollbar-container(class="h-full")
        material-merge-row(
            v-for="(material, index) in mergedList"
            :material="material"
            droppable
            :length="mergedList.length"
            @deleteRow="deleteRow(index)"
            @setRow="setRow(index, $event)"
            @clearBlock="clearBlock(index, $event)"
          )
        div(class="flex items-center justify-center pb-5")
          div(class="inline-block flex items-center justify-center text-body2 text-primary cursor-pointer" @click="addNewRow")
            svg-icon(iconName="add_box" size="24" class="text-black-700")
            span(class="pl-2") {{$t('EE0010')}}
    overlay-scrollbar-container(class="h-full bg-black-200")
      material-merge-row(
        v-for="material in materialList"
        :material="material"
      )
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import MaterialMergeRow from '@/components/assets/material/MaterialMergeRow'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'AssetsMaterialMerge',
  components: {
    FullscreenHeader,
    MaterialMergeRow
  },
  setup () {
    const store = useStore()
    const { goToAssets, goToAssetsMaterialMergePreview } = useNavigation()
    const materialList = computed(() => store.getters['assets/preMergeList'])
    const mergedList = computed(() => store.getters['assets/mergedList'])

    const addNewRow = () => {
      store.commit('assets/ADD_mergedList_row')
    }

    const setRow = (index, row) => {
      store.commit('assets/UPDATE_mergedList_row', { index, item: row })
    }

    const deleteRow = (index) => {
      store.commit('assets/REMOVE_mergedList_row', index)
    }

    const clearBlock = (index, blockType) => {
      store.commit('assets/CLEAR_mergedList_row_block', { index, blockType })
    }

    return {
      materialList,
      mergedList,
      addNewRow,
      deleteRow,
      setRow,
      clearBlock,
      goToAssets,
      goToAssetsMaterialMergePreview
    }
  }
}
</script>
