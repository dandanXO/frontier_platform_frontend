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
    class='relative aspect-ratio rounded bg-black-200 border-block-400 border bg-cover mb-2'
    :class="{'border': neverScanBefore }"
  )
    img(:src="currentCoverImg" class="w-full h-full")
    input-checkbox(
      v-if='active || checked'
      v-model:inputValue='addedMaterialList'
      :value='JSON.stringify(material)'
      class='absolute z-10 top-3 left-3 cursor-pointer'
      iconColor='text-black-0'
    )
    div(v-if="active" class='absolute z-9 inset-0 w-full h-full rounded bg-opacity-70 bg-black-900')
      div(class='text-black-0 px-7.5 py-10 h-full flex flex-col items-center justify-center text-center')
        div(class='line-height-1.6 text-body2 font-bold line-clamp-2') {{material.description}}
        div(class='line-height-1.6 text-caption line-clamp-2') {{material.content}}
        div(class='line-height-1.6 text-caption flex gap-1')
          div {{materialYarnCount}}
          div {{materialDensity}}
          div {{materialWidth}}
        div(class='line-height-1.6 text-caption line-clamp-2') {{material.finish}}
        div(class='line-height-1.6 text-caption line-clamp-1') {{materialWeight}}
      tooltip(
        class='absolute bottom-3 right-3 cursor-pointer'
        placement="right-start"
        :showArrow="false"
        :manual="true"
        :offset="[0, 5]"
      )
        template(#trigger)
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
  div(class='text-primary font-bold text-body1 line-clamp-1 line-height-1.6') {{material.materialNo}}
</template>

<script>
import { ref, computed } from '@vue/runtime-core'
import useAssets from '@/composables/useAssets'
import useMaterial from '@/composables/useMaterial'
import { useStore } from 'vuex'

export default {
  name: 'GridItem',
  props: {
    material: {
      type: Object
    }
  },
  setup (props) {
    const store = useStore()
    const active = ref(false)
    const {
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
    } = useAssets(props.material)

    const { currentCoverImg, neverScanBefore, materialWeight, materialYarnCount, materialDensity, materialWidth } = useMaterial(props.material)

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

    const addedMaterialList = computed({
      get: () => store.getters['assets/addedMaterialList'],
      set: (v) => store.commit('assets/SET_addedMaterialList', v)
    })

    const checked = computed(() => addedMaterialList.value.includes(JSON.stringify(props.material)))

    return {
      addedMaterialList,
      options,
      handleClick,
      currentCoverImg,
      neverScanBefore,
      active,
      checked,
      materialWeight,
      materialYarnCount,
      materialDensity,
      materialWidth
    }
  }
}
</script>
