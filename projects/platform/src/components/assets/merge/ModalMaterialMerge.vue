<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-grey-900 font-bold") {{ $t("EE0006") }}
  template(#right)
    btn-group(
      :primaryText="$t('UU0003')"
      @click:primary="openModalMaterialMergePreview"
      @click:secondary="closeModal"
    )
  template(#content)
    div(class="flex flex-col" style="height: calc(100vh - 64px);")
      div(class="min-h-71.5 bg-grey-0 flex-shrink-0")
        f-scrollbar-container(class="h-full")
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
            div(class="flex items-center justify-center text-body2 text-grey-900 cursor-pointer" @click="addNewRow")
              f-svg-icon(iconName="add_box" size="24" class="text-grey-600")
              span(class="pl-2") {{ $t("EE0010") }}
      div(class="h-7.5 bg-grey-100 flex-shrink-0")
      f-scrollbar-container(class="h-full bg-grey-100")
        div(class="pb-2.5")
          material-merge-row(v-for="rowData in rowList" :rowData="rowData")
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
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
