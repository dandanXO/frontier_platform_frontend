<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-primary font-bold") {{ $t("EE0006") }}
  template(#right)
    btn-group(
      :primaryText="$t('UU0003')"
      @click:primary="openModalMaterialMergePreview"
      @click:secondary="closeModal"
    )
  template(#content)
    div(class="flex flex-col h-full")
      div(class="min-h-71.5 bg-black-0")
        overlay-scrollbar-container(class="h-full")
          material-merge-row(
            v-for="(rowData, index) in mergedList"
            :rowData="rowData"
            droppable
            :length="mergedList.length"
            @deleteRow="deleteRow(index)"
            @setRow="setRow(index, $event)"
            @clearBlock="clearBlock(index, $event)"
          )
  div(class="flex items-center justify-center pb-5")
    div(class="flex items-center justify-center text-body2 text-primary cursor-pointer" @click="addNewRow")
      svg-icon(iconName="add_box" size="24" class="text-black-700")
      span(class="pl-2") {{ $t("EE0010") }}
      overlay-scrollbar-container(class="h-full bg-black-200")
        material-merge-row(v-for="rowData in rowList" :rowData="rowData")
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import MaterialMergeRow from '@/components/assets/merge/MaterialMergeRow.vue'
import { SIDE_TYPE } from '@/utils/constants'

const getDefaultMergeRow = () => ({
  faceSide: {
    materialId: null,
    sideType: null,
    faceSideImg: null
  },
  backSide: {
    materialId: null,
    sideType: null,
    backSideImg: null
  },
  detail: {}
})

export default {
  name: 'ModalMaterialMerge',
  components: {
    FullscreenHeader,
    MaterialMergeRow
  },
  props: {
    materialList: {
      type: Array
    }
  },
  setup (props) {
    const store = useStore()
    const mergedList = reactive([getDefaultMergeRow()])

    const rowList = computed(() => {
      return props.materialList
        .map(material => {
          const { isDoubleSideMaterial, materialId, relationMaterialId, faceSideImg, backSideImg } = material
          const row = getDefaultMergeRow()

          row.faceSide = {
            materialId: materialId,
            sideType: SIDE_TYPE.FACE,
            imageInfo: faceSideImg
          }

          row.backSide = {
            materialId: isDoubleSideMaterial ? relationMaterialId : materialId,
            sideType: SIDE_TYPE.BACK,
            imageInfo: backSideImg
          }

          row.detail = material

          return row
        })
    })

    const addNewRow = () => {
      mergedList.push(getDefaultMergeRow())
    }

    const setRow = (index, row) => {
      Object.assign(mergedList[index], row)
    }

    const deleteRow = (index) => {
      mergedList.splice(index, 1)
    }

    const clearBlock = (index, blockType) => {
      mergedList[index][blockType] = {}
    }

    const closeModal = () => {
      store.dispatch('helper/closeModal')
    }

    const openModalMaterialMergePreview = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-material-merge-preview',
        properties: { mergedList }
      })
    }

    return {
      rowList,
      mergedList,
      addNewRow,
      deleteRow,
      setRow,
      clearBlock,
      closeModal,
      openModalMaterialMergePreview
    }
  }
}
</script>
