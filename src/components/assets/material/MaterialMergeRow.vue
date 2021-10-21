<template lang="pug">
div(class="flex my-5 mx-auto pl-17 pr-7 relative max-w-286")
  template(v-if="droppable")
    div(class="relative mr-11")
      div(v-if="length > 1" class="absolute -left-8.5 top-20" @click="deleteRow")
        svg-icon(iconName="delete" size="24" class="cursor-pointer text-black-700")
      div(v-if="material.[BLOCK_TYPE.FACE].exist" class="flex justify-center items-center absolute right-3 top-3 w-5 h-5 rounded-full bg-black-0 bg-opacity-70 cursor-pointer" @click="clearBlock(BLOCK_TYPE.FACE)")
        svg-icon(iconName="clear" size="14" class="text-black-700")
      div(class="w-47.5 h-47.5 rounded" :style="getBgImg(BLOCK_TYPE.FACE)" :class="[!material.[BLOCK_TYPE.FACE].exist ? emptyBoxClass : '']" :data-type="BLOCK_TYPE.FACE" @drop="onDrop($event)" @dragover.prevent)
        template(v-if="!material.[BLOCK_TYPE.FACE].exist") {{$t('EE0007')}}
    div(class="relative mr-11")
      div(v-if="material.[BLOCK_TYPE.BACK].exist" class="flex justify-center items-center absolute right-3 top-3 w-5 h-5 rounded-full bg-black-0 bg-opacity-70 cursor-pointer" @click="clearBlock(BLOCK_TYPE.BACK)")
        svg-icon(iconName="clear" size="14" class="text-black-700")
      div(class="w-47.5 h-47.5 rounded" :style="getBgImg(BLOCK_TYPE.BACK)" :class="[!material.[BLOCK_TYPE.BACK].exist ? emptyBoxClass : '']" :data-type="BLOCK_TYPE.BACK" @drop="onDrop($event)" @dragover.prevent)
        template(v-if="!material.[BLOCK_TYPE.BACK].exist") {{$t('EE0008')}}
    div(class="relative w-full")
      div(v-if="material.[BLOCK_TYPE.DETAIL].exist" class="flex justify-center items-center absolute right-3 top-3 w-5 h-5 rounded-full bg-black-0 bg-opacity-70 cursor-pointer" @click="clearBlock(BLOCK_TYPE.DETAIL)")
        svg-icon(iconName="clear" size="14" class="text-black-700")
      div(class="h-47.5 rounded p-7.5" :class="[!material.[BLOCK_TYPE.DETAIL].exist ? emptyBoxClass : filledTextBoxClass]" :data-type="BLOCK_TYPE.DETAIL" @drop="onDrop($event)" @dragover.prevent)
        template(v-if="!material.[BLOCK_TYPE.DETAIL].exist") {{$t('EE0009')}}
        template(v-else) {{material.detail.word}}
  template(v-else)
    div(class="relative mr-11" )
      div(v-if="material.[BLOCK_TYPE.FACE].faceSideImg" class="absolute -left-6 top-20")
        svg-icon(iconName="drag_indicator" size="24" class="text-black-500")
      div(class="w-47.5 h-47.5 rounded border-2 border-solid border-black-400" :class="{'border-none': material.[BLOCK_TYPE.FACE].faceSideImg}")
        img(:src="material.[BLOCK_TYPE.FACE].faceSideImg" class="cursor-move rounded" :data-type='BLOCK_TYPE.FACE' draggable="true" @dragstart='startDrag($event)')
    div(class="relative mr-11")
      div(v-if="material.[BLOCK_TYPE.BACK].backSideImg" class="absolute -left-6 top-20")
        svg-icon(iconName="drag_indicator" size="24" class="text-black-500")
      div(class="w-47.5 h-47.5 rounded border-2 border-solid border-black-400" :class="{'border-none': material.[BLOCK_TYPE.BACK].backSideImg}")
        img(:src="material.[BLOCK_TYPE.BACK].backSideImg" class="cursor-move rounded" :data-type='BLOCK_TYPE.BACK' draggable="true" @dragstart='startDrag($event)')
    div(class="relative w-full")
      div(v-if="material.[BLOCK_TYPE.DETAIL].word" class="absolute -left-6 top-20")
        svg-icon(iconName="drag_indicator" size="24" class="text-black-500")
      div(class="h-47.5 rounded border-2 border-solid border-black-400 cursor-move p-7.5" :data-type='BLOCK_TYPE.DETAIL' draggable="true" @dragstart='startDrag($event)') {{material.[BLOCK_TYPE.DETAIL].word}}
</template>

<script>
export default {
  name: 'MaterialMergeRow',
  props: {
    droppable: {
      type: Boolean,
      default: false
    },
    material: {
      type: Object,
      default: () => { }
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
      const path = props.material[blockType][`${fromType}Img`]
      return { 'background-image': `url(${path})` }
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

      copyMaterial[toType] = { ...item[item.fromType], fromType: item.fromType, exist: item.exist }
      emit('setRow', copyMaterial)
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
