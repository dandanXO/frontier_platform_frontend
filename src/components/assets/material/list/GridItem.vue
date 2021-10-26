<style lang="scss" scoped>
.linear-bg {
  background: linear-gradient(180deg, #000000 0%, rgba(34, 34, 34, 0) 100%);
}
</style>

<template lang="pug">
div(
  class='w-full'
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
    div(v-if='active' class='w-full h-full rounded bg-opacity-70 bg-black-900 bg-black')
      div(class='absolute linear-bg bg-opacity-15 rounded h-12')
      div(class='line-height-1.6 text-body2 text-black-0 max-w-38 m-auto h-full flex flex-col items-center justify-center')
        div(class='font-bold') {{material.materialNo}}
        div(class='text-body1 font-bold line-clamp-2') {{material.description}}
        div(class='line-clamp-1') {{material.content}}
        div(class='line-clamp-1')
          span(class='pr-1') {{material.warpYarnCount}}X{{material.weftYarnCount}}
          span(class='pr-1') {{material.warpDensity}}X{{material.weftDensity}}
          span {{material.width}}
        div(class='line-clamp-1') {{material.finish}}
        div(class='line-clamp-1') {{getWeightValue}}
      tooltip(
        class='absolute bottom-3 right-3 cursor-pointer'
        placement="right"
        :showArrow="false"
        :manual="true"
        :offset="['50%', 5]"
      )
        svg-icon(iconName='more_vert' size='20' class="text-black-500 hover:text-black-200" )
        template(#content)
          div(class='w-55 py-2.5')
            div(v-for="(block, index) in options" class='text-black-400')
              list-item(
                v-for="option in block"
                class='text-body2 text-primary px-7'
                @click="handleClick(option)"
              ) {{option.name}}
              div(class="mx-2 my-1" :class='{"border-b": index !== options.length-1}')
  div(class='text-primary font-bold text-body1 line-clamp-1 line-height-1.6') {{material.description}}
</template>

<script>
import { ref, computed } from '@vue/runtime-core'
import useAssets from '@/composables/useAssets'

export default {
  name: 'GridItem',
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
    const {
      weight,
      editMaterial,
      printCard,
      downloadU3M,
      carbonCopy,
      cloneTo,
      addToWorkspace,
      create3DMaterial,
      exportExcel,
      printQRCode,
      deleteMaterial
    } = useAssets()

    const options = [
      [
        editMaterial
      ],
      [
        carbonCopy,
        cloneTo,
        addToWorkspace
      ],
      [
        create3DMaterial,
        downloadU3M,
        exportExcel
      ],
      [
        printQRCode,
        printCard
      ],
      [
        deleteMaterial
      ]
    ]

    const handleClick = (option) => {
      option.func && option.func()
    }

    const coverImg = computed(() => {
      return {
        'background-image': `url(${props.material.coverImg})`
      }
    })

    const checked = computed(() => {
      return props.addedMaterialList.includes(props.material.materialId)
    })

    const getWeightValue = computed(() => {
      const { weightUnit, weightOz, weightGsm } = props.material
      return weight({ weightUnit, weightOz, weightGsm })
    })

    return {
      options,
      handleClick,
      coverImg,
      active,
      getWeightValue,
      checked
    }
  }
}
</script>
