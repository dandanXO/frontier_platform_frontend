<template lang="pug">
div(class="flex h-47.5 gap-x-11 content-start")
  template(v-if="droppable")
    div(
      v-for="(val, blockType) in rowData.block"
      :key="blockType"
      class="relative h-full"
      :class="{ 'flex-grow': blockType === BLOCK_TYPE.DETAIL }"
    )
      div(
        v-if="length && length > 1 && blockType === BLOCK_TYPE.FACE"
        class="absolute right-full top-1/2 transform -translate-y-1/2"
        @click="$emit('deleteRow')"
      )
        f-svg-icon(iconName="delete" size="24" class="cursor-pointer text-grey-600")
      div(
        v-if="val"
        class="flex justify-center items-center absolute right-2 top-2 w-5 h-5 rounded-full cursor-pointer group hover:shadow-4"
        :class="[blockType === BLOCK_TYPE.DETAIL ? 'bg-grey-100 hover:bg-grey-0/80' : 'bg-grey-0/80']"
        @click="$emit('clearBlock', blockType)"
      )
        f-svg-icon(
          iconName="clear"
          size="14"
          class="text-grey-900 group-hover:text-primary-400"
        )
      div(
        v-if="blockType !== BLOCK_TYPE.DETAIL"
        class="w-47.5 h-full rounded bg-cover flex-shrink-0"
        :style="{ 'background-image': `url(${val?.sideImage?.thumbnailUrl})` }"
        :class="[!val ? emptyBoxClass : '']"
        :data-type="blockType"
        @drop="onDrop($event, blockType)"
        @dragover.prevent
      )
        p(v-if="!val" class="px-4 leading-1.6 text-center pointer-events-none") {{ blockType === BLOCK_TYPE.FACE ? $t('EE0007') : $t('EE0008') }}
      div(
        v-else
        class="h-full rounded"
        :class="[!val ? emptyBoxClass : filledTextBoxClass]"
        :data-type="blockType"
        @drop="onDrop($event, blockType)"
        @dragover.prevent
      )
        p(v-if="!val" class="px-4 leading-1.6 text-center pointer-events-none") {{ $t('EE0009') }}
        material-merge-row-detail(
          v-else
          :material="val.material"
          :key="Number(val.materialSideId)"
        )
  template(v-else)
    div(
      v-for="(val, blockType) in rowData.block"
      :key="blockType"
      class="relative h-full"
      :class="{ 'flex-grow': blockType === BLOCK_TYPE.DETAIL }"
    )
      div(v-if="val" class="absolute right-full top-1/2 transform -translate-y-1/2")
        f-svg-icon(iconName="drag_indicator" size="24" class="text-grey-250")
      div(
        v-if="blockType !== BLOCK_TYPE.DETAIL"
        class="w-47.5 h-full rounded border-2 border-solid border-grey-250"
        :class="{ 'border-none': val !== null }"
      )
        img(
          v-if="val"
          :src="val.sideImage?.thumbnailUrl"
          class="w-full h-full cursor-move rounded"
          :data-type="blockType"
          draggable="true"
          @dragstart="startDrag($event, blockType)"
        )
      div(
        v-else
        class="rounded border-2 border-solid border-grey-250 cursor-move"
        :data-type="blockType"
        draggable="true"
        @dragstart="startDrag($event, blockType)"
      )
        material-merge-row-detail(v-if="val" :material="val.material")
</template>

<script setup lang="ts">
import MaterialMergeRowDetail from '@/components/assets/merge/MaterialMergeRowDetail.vue'
import type { MergeRow } from '@/components/assets/merge/ModalMaterialMerge.vue'

const props = defineProps<{
  rowData: MergeRow
  droppable?: boolean
  length?: number
}>()

const emit = defineEmits<{
  (e: 'deleteRow'): void
  (
    e: 'setRow',
    payload: {
      blockType: keyof MergeRow['block']
      blockData:
        | MergeRow['block']['faceSide']
        | MergeRow['block']['backSide']
        | MergeRow['block']['detail']
    }
  ): void
  (e: 'clearBlock', blockType: keyof MergeRow['block']): void
}>()

const emptyBoxClass =
  'flex justify-center items-center border-2 border-dashed border-grey-600 text-grey-900 text-caption'
const filledTextBoxClass = 'border-2 border-solid border-grey-250'

const BLOCK_TYPE = {
  FACE: 'faceSide',
  BACK: 'backSide',
  DETAIL: 'detail',
}

const startDrag = (e: DragEvent, fromType: keyof MergeRow['block']) => {
  const item = { block: props.rowData.block, fromType }

  if (e.dataTransfer) {
    e.dataTransfer.setData('item', JSON.stringify(item))
    e.dataTransfer.setDragImage(e.target, 95, 95)
  }
}

const onDrop = (e: DragEvent, toType: keyof MergeRow['block']) => {
  const item = JSON.parse(e.dataTransfer.getData('item'))

  // 防止將圖檔和文檔拖曳到不該放置的區域
  if (item.fromType === BLOCK_TYPE.DETAIL && toType !== BLOCK_TYPE.DETAIL) {
    return
  }
  if (item.fromType !== BLOCK_TYPE.DETAIL && toType === BLOCK_TYPE.DETAIL) {
    return
  }

  if (toType) {
    emit('setRow', {
      blockType: toType,
      blockData: item.block[item.fromType],
    })
  }
}
</script>
