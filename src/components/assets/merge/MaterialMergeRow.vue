<template lang="pug">
div(class="flex my-5 mx-auto pl-17 pr-7 relative max-w-286")
  template(v-if="droppable")
    template(v-for="(material, blockType) in rowData")
      div(v-if="blockType !== BLOCK_TYPE.DETAIL" class="relative mr-11")
        div(v-if="length > 1 && blockType === BLOCK_TYPE.FACE" class="absolute -left-8.5 top-20" @click="deleteRow")
          svg-icon(iconName="delete" size="24" class="cursor-pointer text-black-700")
        div(v-if="material.exist" class="flex justify-center items-center absolute right-3 top-3 w-5 h-5 rounded-full bg-black-0 bg-opacity-70 cursor-pointer" @click="clearBlock(blockType)")
          svg-icon(iconName="clear" size="14" class="text-black-700")
        div(class="w-47.5 h-47.5 rounded bg-cover" :style="getBgImg(blockType)" :class="[!material.exist ? emptyBoxClass : '']" :data-type="blockType" @drop="onDrop($event)" @dragover.prevent)
          p(v-if="!material.exist" class="px-4 line-height-1.6 text-center pointer-events-none" ) {{blockType === BLOCK_TYPE.FACE ? $t("EE0007") : $t("EE0008")}}
      div(v-else class="relative w-full")
        div(v-if="material.exist" class="flex justify-center items-center absolute right-3 top-3 w-5 h-5 rounded-full bg-black-0 bg-opacity-70 cursor-pointer" @click="clearBlock(blockType)")
          svg-icon(iconName="clear" size="14" class="text-black-700")
        div(class="h-47.5 rounded" :class="[!material.exist ? emptyBoxClass : filledTextBoxClass]" :data-type="blockType" @drop="onDrop($event)" @dragover.prevent)
          p(v-if="!material.exist" class="px-4 line-height-1.6 text-center pointer-events-none") {{$t('EE0009')}}
          material-merge-row-detail(v-else :material="material")
  template(v-else)
    template(v-for="(material, blockType) in rowData")
      div(v-if="blockType !== BLOCK_TYPE.DETAIL" class="relative mr-11")
        div(v-if="material.imageInfo.crop" class="absolute -left-6 top-20")
          svg-icon(iconName="drag_indicator" size="24" class="text-black-500")
        div(class="w-47.5 h-47.5 rounded border-2 border-solid border-black-400" :class="{'border-none': material.imageInfo.crop}")
          img(v-if="material.imageInfo.crop" :src="material.imageInfo.crop" class="w-full h-full cursor-move rounded" :data-type="blockType" draggable="true" @dragstart="startDrag($event)")
      div(v-else class="relative w-full")
        div(class="absolute -left-6 top-20")
          svg-icon(iconName="drag_indicator" size="24" class="text-black-500")
        div(class="h-47.5 rounded border-2 border-solid border-black-400 cursor-move" :data-type="blockType" draggable="true" @dragstart="startDrag($event)")
          material-merge-row-detail(:material="material")
</template>

<script>
import MaterialMergeRowDetail from '@/components/assets/merge/MaterialMergeRowDetail'

export default {
  name: 'MaterialMergeRow',
  components: { MaterialMergeRowDetail },
  props: {
    droppable: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object
    },
    length: {
      type: Number,
      default: 0
    }
  },
  emits: ['deleteRow', 'setRow', 'clearBlock'],
  setup (props, { emit }) {
    const emptyBoxClass = 'flex justify-center items-center border-2 border-dashed border-black-600 text-primary text-caption'
    const filledTextBoxClass = 'border-2 border-solid border-black-400'

    const BLOCK_TYPE = {
      FACE: 'faceSide',
      BACK: 'backSide',
      DETAIL: 'detail'
    }

    const getBgImg = (blockType) => {
      if (props.rowData[blockType]?.materialId) {
        const path = props.rowData[blockType].imageInfo.crop
        return { 'background-image': `url(${path})` }
      }
    }

    const startDrag = (e) => {
      const fromType = e.target.dataset.type
      const item = { ...props.rowData, fromType, exist: true }
      e.dataTransfer.setData('item', JSON.stringify(item))
      e.dataTransfer.setDragImage(e.target, 95, 95)
    }

    const onDrop = (e) => {
      const copyRowData = JSON.parse(JSON.stringify(props.rowData))
      const toType = e.target.dataset.type
      const item = JSON.parse(e.dataTransfer.getData('item'))

      // 防止將圖檔和文檔拖曳到不該放置的區域
      if (item.fromType === BLOCK_TYPE.DETAIL && toType !== BLOCK_TYPE.DETAIL) return
      if (item.fromType !== BLOCK_TYPE.DETAIL && toType === BLOCK_TYPE.DETAIL) return

      if (toType) {
        copyRowData[toType] = { ...item[item.fromType], fromType: item.fromType, exist: item.exist }
        emit('setRow', copyRowData)
      }
    }

    const deleteRow = () => {
      emit('deleteRow')
    }

    const clearBlock = (blockType) => {
      emit('clearBlock', blockType)
    }

    return {
      BLOCK_TYPE,
      emptyBoxClass,
      filledTextBoxClass,
      getBgImg,
      onDrop,
      startDrag,
      deleteRow,
      clearBlock
    }
  }
}
</script>
