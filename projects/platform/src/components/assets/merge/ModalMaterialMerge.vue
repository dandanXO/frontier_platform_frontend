<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-grey-900 font-bold") {{ $t('EE0006') }}
  template(#right)
    btn-group(
      :primaryText="$t('UU0003')"
      @click:primary="openModalMaterialMergePreview"
      :primaryButtonDisabled="validMergedList.length === 0"
      @click:secondary="closeModal"
    )
  template(#content)
    div(class="flex flex-col" style="height: calc(100vh - 64px)")
      f-scrollbar-container(class="h-78 bg-grey-0 flex-shrink-0")
        div(class="max-w-280 mx-auto pt-8 pr-3 grid gap-y-5")
          div(v-for="(rowData, index) in mergedList" :key="index" class="grid gap-y-1.5")
            material-merge-row(
              :rowData="rowData"
              droppable
              :length="mergedList.length"
              @deleteRow="deleteRow(index)"
              @setRow="setRow(index, $event)"
              @clearBlock="clearBlock(index, $event)"
            )
            f-input-checkbox(
              binary
              v-model:inputValue="rowData.isComposite"
              :label="$t('MI0004')"
              iconSize="20"
              class="justify-self-end"
            )
          div(class="flex items-center justify-center")
            div(
              class="flex items-center justify-center text-body2 text-grey-900 cursor-pointer group hover:text-primary-400"
              @click="addNewRow"
            )
              f-svg-icon(
                iconName="add_box"
                size="24"
                class="text-grey-600 group-hover:text-primary-400"
              )
              span(class="pl-2") {{ $t('EE0010') }}
      f-scrollbar-container(class="pt-16.5 h-full bg-grey-100")
        div(class="relative pb-2.5 max-w-280 mx-auto pr-3 grid gap-y-5")
          div(
            class="absolute bottom-full pb-2.5 left-0 w-full flex gap-x-11 text-caption/1.3 text-grey-900"
          )
            div(class="w-47.5 text-center") {{ $t('PP0033') }}
            div(class="w-47.5 text-center") {{ $t('PP0032') }}
            div(class="flex-grow text-center flex items-center justify-center gap-x-1")
              span {{ $t('RR0130') }}
              f-svg-icon(
                iconName="info_outline"
                size="14"
                class="text-grey-600"
                tooltip-message="Based on default material information"
              )
          material-merge-row(
            v-for="(rowData, index) in rowList"
            :key="index"
            :rowData="rowData"
          )
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import MaterialMergeRow from '@/components/assets/merge/MaterialMergeRow.vue'
import type {
  Material,
  MaterialSideAllOfSideImage,
} from '@frontier/platform-web-sdk'
import { getMaterialMainSide } from '@/utils/material/getMaterialMainSide'

const props = defineProps<{
  materialList: Material[]
}>()
const store = useStore()

export interface Side {
  materialSideId: number | null
  sideImage: MaterialSideAllOfSideImage | null
}

export interface MergeRow {
  block: {
    faceSide: Side | null
    backSide: Side | null
    detail: {
      materialSideId: number
      material: Material
    } | null
  }
  isComposite: boolean
}

const getDefaultMergeRow = () =>
  ({
    block: {
      faceSide: null,
      backSide: null,
      detail: null,
    },
    isComposite: false,
  } as MergeRow)

const mergedList = reactive([getDefaultMergeRow()])

const rowList = computed(() => {
  return props.materialList.map((material) => {
    const { faceSide, backSide } = material
    const row = getDefaultMergeRow()

    if (faceSide) {
      row.block.faceSide = {
        materialSideId: faceSide.materialSideId,
        sideImage: faceSide.sideImage,
      }
    }

    if (backSide) {
      row.block.backSide = {
        materialSideId: backSide.materialSideId,
        sideImage: backSide.sideImage,
      }
    }

    row.block.detail = {
      materialSideId: getMaterialMainSide(material).materialSideId,
      material,
    }

    return row
  })
})

const addNewRow = () => {
  mergedList.push(getDefaultMergeRow())
}

const setRow = (
  index: number,
  payload: {
    blockType: keyof MergeRow['block']
    blockData:
      | MergeRow['block']['faceSide']
      | MergeRow['block']['backSide']
      | MergeRow['block']['detail']
  }
) => {
  mergedList[index].block[payload.blockType] = payload.blockData
}

const deleteRow = (index: number) => {
  mergedList.splice(index, 1)
}

const clearBlock = (index: number, blockType: keyof MergeRow['block']) => {
  mergedList[index].block[blockType] = null
}

const closeModal = () => {
  store.dispatch('helper/closeModal')
}

const validMergedList = computed(() => {
  return mergedList.filter(
    (row) => (row.block.faceSide || row.block.backSide) && row.block.detail
  )
})

const openModalMaterialMergePreview = () => {
  store.dispatch('helper/pushModal', {
    component: 'modal-material-merge-preview',
    properties: { mergedList: validMergedList },
  })
}
</script>
