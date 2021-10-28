<template lang="pug">
div(
  class='w-full min-w-42.5 max-w-67.5'
  @mouseenter="active = true"
  @mouseleave="active = false"
)
  div(class='pb-2.5 flex justify-between')
    div(class="font-bold text-primary") ED09643
    svg-icon(:iconName='iconName' size='24' class="text-primary")
  div(
    class='relative aspect-ratio rounded bg-black-200 border-block-400 border-2 bg-cover mb-2.5'
    :class="{'border-none': !!coverImg}"
    :style='coverImg'
  )
    input-checkbox(
      v-if='active || checked'
      v-model:inputValue='addedMaterialList'
      :value='material.materialId'
      class='absolute top-3 left-3 cursor-pointer'
      iconColor='text-black-0'
    )
    div(v-if='active' class='w-full h-full rounded bg-opacity-70 bg-black-900 bg-black text-black-0')
      div(class='linear-bg bg-opacity-15 rounded h-12')
  div(class='text-primary text-body1 line-clamp-1 line-height-1.6') {{material.description}}
</template>

<script>
import { ref, computed } from '@vue/runtime-core'

const SIDE_TYPE = {
  FACE: 1,
  BACK: 2
}

export default {
  name: 'RowItemImg',
  props: {
    material: {
      type: Object
    },
    addedMaterialList: {
      type: Array
    }
  },
  setup (props) {
    const active = ref(false)

    const iconName = computed(() => {
      const isFaceSideImgExist = !!props.material.faceSideImg.crop
      const isBackSideImgExist = !!props.material.backSideImg.crop

      if (props.material.isDoubleSideMaterial) {
        if (isFaceSideImgExist && isBackSideImgExist) return 'double'
        else if (isFaceSideImgExist && !isBackSideImgExist) return 'double-front'
        else if (!isFaceSideImgExist && isBackSideImgExist) return 'double-back'
        else if (!isFaceSideImgExist && !isBackSideImgExist) return 'no-image-double'
      } else {
        if (props.material.sideType === SIDE_TYPE.FACE) return isFaceSideImgExist ? 'front' : 'no-image-front'
        else if (props.material.sideType === SIDE_TYPE.BACK) return isBackSideImgExist ? 'back' : 'no-image-back'
      }
    })

    const coverImg = computed(() => {
      return {
        'background-image': `url(${props.material.coverImg})`
      }
    })

    const checked = computed(() => {
      return props.addedMaterialList.includes(props.material.materialId)
    })

    return {
      iconName,
      coverImg,
      active,
      checked
    }
  }
}
</script>
