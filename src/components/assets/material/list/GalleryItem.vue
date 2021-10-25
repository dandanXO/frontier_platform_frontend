<style lang="scss" scoped>
.linear-bg {
  background: linear-gradient(180deg, #000000 0%, rgba(34, 34, 34, 0) 100%);
}
</style>

<template lang="pug">
div(
  class='w-full min-w-57.5 max-w-78'
  @mouseenter="active = true"
  @mouseleave="active = false"
)
  div(
    class='relative aspect-ratio rounded bg-black-200 border-block-400 border-2 bg-cover mb-2'
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
      div(class='absolute linear-bg bg-opacity-15 rounded h-12')
      div(class='text-body2 max-w-38 m-auto h-full flex flex-col items-center justify-center')
        div(class='font-bold mb-2') {{material.materialNo}}
        div(class='text-body1 font-bold mb-2 line-clamp-2') {{material.description}}
        div(class='mb-2 line-clamp-1') {{material.content}}
        div(class='mb-2 line-clamp-1')
          span(class='pr-1') {{material.warpYarnCount}}X{{material.weftYarnCount}}
          span(class='pr-1') {{material.warpDensity}}X{{material.weftDensity}}
          span {{material.width}}
        div(class='mb-2 line-clamp-1') {{material.finish}}
        div(class='line-clamp-1') {{weight}}&sup2
      div(class='absolute bottom-3 right-3 cursor-pointer')
        svg-icon(iconName='more_vert' size='20' class="text-black-500 hover:text-black-200" )
  div(class='text-primary font-bold text-body1 line-clamp-1') {{material.description}}
</template>

<script>
import { ref, computed } from '@vue/runtime-core'

const ENUM = {
  GSM: 1,
  OZ: 2
}

export default {
  name: 'GalleryItem',
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

    const coverImg = computed(() => {
      return {
        'background-image': `url(${props.material.coverImg})`
      }
    })

    const checked = computed(() => {
      return props.addedMaterialList.includes(props.material.materialId)
    })

    const weight = computed(() => {
      if (props.material.weightUnit === ENUM.GSM) {
        return `${props.material.weightGsm} g/m`
      } else if (props.material.weightUnit === ENUM.OZ) {
        return `${props.material.weightOz} oz/y`
      }
    })

    return {
      coverImg,
      active,
      weight,
      checked
    }
  }
}
</script>
