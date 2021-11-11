<template lang="pug">
div(class="flex my-5 mx-auto pl-17 pr-7 relative max-w-286")
  template(v-if="droppable")
    div(class="relative mr-11")
      div(v-if="length > 1" class="absolute -left-8.5 top-20" @click="deleteRow")
        svg-icon(iconName="delete" size="24" class="cursor-pointer text-black-700")
      div(v-if="material.[BLOCK_TYPE.FACE].exist" class="flex justify-center items-center absolute right-3 top-3 w-5 h-5 rounded-full bg-black-0 bg-opacity-70 cursor-pointer" @click="clearBlock(BLOCK_TYPE.FACE)")
        svg-icon(iconName="clear" size="14" class="text-black-700")
      div(class="w-47.5 h-47.5 rounded bg-cover" :style="getBgImg(BLOCK_TYPE.FACE)" :class="[!material.[BLOCK_TYPE.FACE].exist ? emptyBoxClass : '']" :data-type="BLOCK_TYPE.FACE" @drop="onDrop($event)" @dragover.prevent)
        p(v-if="!material.[BLOCK_TYPE.FACE].exist" class="px-4 line-height-1.6 text-center pointer-events-none" ) {{$t('EE0007')}}
    div(class="relative mr-11")
      div(v-if="material.[BLOCK_TYPE.BACK].exist" class="flex justify-center items-center absolute right-3 top-3 w-5 h-5 rounded-full bg-black-0 bg-opacity-70 cursor-pointer" @click="clearBlock(BLOCK_TYPE.BACK)")
        svg-icon(iconName="clear" size="14" class="text-black-700")
      div(class="w-47.5 h-47.5 rounded bg-cover" :style="getBgImg(BLOCK_TYPE.BACK)" :class="[!material.[BLOCK_TYPE.BACK].exist ? emptyBoxClass : '']" :data-type="BLOCK_TYPE.BACK" @drop="onDrop($event)" @dragover.prevent)
        p(v-if="!material.[BLOCK_TYPE.BACK].exist" class="px-4 line-height-1.6 text-center pointer-events-none") {{$t('EE0008')}}
    div(class="relative w-full")
      div(v-if="material.[BLOCK_TYPE.DETAIL].exist" class="flex justify-center items-center absolute right-3 top-3 w-5 h-5 rounded-full bg-black-0 bg-opacity-70 cursor-pointer" @click="clearBlock(BLOCK_TYPE.DETAIL)")
        svg-icon(iconName="clear" size="14" class="text-black-700")
      div(class="h-47.5 rounded" :class="[!material.[BLOCK_TYPE.DETAIL].exist ? emptyBoxClass : filledTextBoxClass]" :data-type="BLOCK_TYPE.DETAIL" @drop="onDrop($event)" @dragover.prevent)
        p(v-if="!material.[BLOCK_TYPE.DETAIL].exist" class="px-4 line-height-1.6 text-center pointer-events-none") {{$t('EE0009')}}
        material-merge-row-detail(v-else :material='material.[BLOCK_TYPE.DETAIL]')
  template(v-else)
    div(class="relative mr-11" )
      div(v-if="material.[BLOCK_TYPE.FACE].faceSideImg.crop" class="absolute -left-6 top-20")
        svg-icon(iconName="drag_indicator" size="24" class="text-black-500")
      div(class="w-47.5 h-47.5 rounded border-2 border-solid border-black-400" :class="{'border-none': material.[BLOCK_TYPE.FACE].faceSideImg.crop}")
        img(v-if="material.[BLOCK_TYPE.FACE].faceSideImg.crop" :src="material.[BLOCK_TYPE.FACE].faceSideImg.crop" class="w-full h-full cursor-move rounded" :data-type='BLOCK_TYPE.FACE' draggable="true" @dragstart='startDrag($event)')
    div(class="relative mr-11")
      div(v-if="material.[BLOCK_TYPE.BACK].backSideImg.crop" class="absolute -left-6 top-20")
        svg-icon(iconName="drag_indicator" size="24" class="text-black-500")
      div(class="w-47.5 h-47.5 rounded border-2 border-solid border-black-400" :class="{'border-none': material.[BLOCK_TYPE.BACK].backSideImg.crop}")
        img(v-if="material.[BLOCK_TYPE.BACK].backSideImg.crop" :src="material.[BLOCK_TYPE.BACK].backSideImg.crop" class="w-full h-full cursor-move rounded" :data-type='BLOCK_TYPE.BACK' draggable="true" @dragstart='startDrag($event)')
    div(class="relative w-full")
      div(class="absolute -left-6 top-20")
        svg-icon(iconName="drag_indicator" size="24" class="text-black-500")
      div(class="h-47.5 rounded border-2 border-solid border-black-400 cursor-move" :data-type='BLOCK_TYPE.DETAIL' draggable="true" @dragstart='startDrag($event)')
        material-merge-row-detail(:material='material.[BLOCK_TYPE.DETAIL]')
</template>

<script>
import MaterialMergeRowDetail from '@/components/assets/material/MaterialMergeRowDetail'

export default {
  name: 'MaterialMergeRow',
  components: { MaterialMergeRowDetail },
  props: {
    droppable: {
      type: Boolean,
      default: false
    },
    material: {
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
      const fromType = props.material[blockType].fromType
      if (fromType) {
        const path = props.material[blockType][`${fromType}Img`].crop
        return { 'background-image': `url(${path})` }
      }
    }

    const startDrag = (e) => {
      const fromType = e.target.dataset.type
      const item = { ...props.material, fromType, exist: true }
      e.dataTransfer.setData('item', JSON.stringify(item))
    }

    const onDrop = (e) => {
      const copyMaterial = JSON.parse(JSON.stringify(props.material))
      const toType = e.target.dataset.type
      const item = JSON.parse(e.dataTransfer.getData('item'))

      // 防止將圖檔和文檔拖曳到不該放置的區域
      if (item.fromType === BLOCK_TYPE.DETAIL && toType !== BLOCK_TYPE.DETAIL) return
      if (item.fromType !== BLOCK_TYPE.DETAIL && toType === BLOCK_TYPE.DETAIL) return

      if (toType) {
        copyMaterial[toType] = { ...item[item.fromType], fromType: item.fromType, exist: item.exist }
        emit('setRow', copyMaterial)
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
