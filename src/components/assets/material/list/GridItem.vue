<template lang="pug">
div(class="w-full")
  div(
    class="relative aspect-ratio"
    @mouseenter="handleMouseEnter"
    @mouseleave="isHover = false"
  )
    div(class="w-full h-full rounded overflow-hidden bg-cover" :class="{'border': neverScanBefore }")
      img(:src="currentCoverImg" class="w-full h-full")
    div(v-if="isHover || haveSelectedMoreThanOne" class="absolute z-10 inset-0 w-full h-12")
      div(class="bg-linear w-full h-full rounded-t-md")
      input-checkbox(
        v-model:inputValue="innerSelectedList"
        :value="JSON.stringify(material)"
        class="absolute top-3 left-3 cursor-pointer"
        iconColor="text-black-0"
        uncheckColor="text-black-0"
      )
    div(v-show="isHover" class="absolute z-9 inset-0 w-full h-full rounded bg-opacity-70 bg-black-900")
      div(class="text-black-0 px-7.5 py-10 h-full flex flex-col items-center justify-center text-center" @click.stop="goToAssetMaterialDetail(material)")
        div(class="line-height-1.6 text-body2 font-bold line-clamp-2") {{material.description}}
        div(class="line-height-1.6 text-caption line-clamp-2") {{material.content}}
        div(class="line-height-1.6 text-caption flex gap-1")
          div {{materialInfo.yarn.value}}
          div {{materialInfo.density.value}}
          div {{materialInfo.width.value}}
        div(class="line-height-1.6 text-caption line-clamp-2") {{material.finish}}
        div(class="line-height-1.6 text-caption line-clamp-1") {{materialInfo.weight.value}}
      tooltip(
        v-if="innerSelectedList.length === 0"
        class="absolute bottom-3 right-3 cursor-pointer"
        placement="right-start"
        :showArrow="false"
        :manual="true"
        :offset="[0, 5]"
        :key="randomKey"
      )
        template(#trigger)
          svg-icon(iconName="more_vert" size="20" class="text-black-500 hover:text-black-200" )
        template(#content)
          div(class="w-55 py-2.5")
            div(v-for="(block, index) in options" class="text-black-400")
              template(v-for="option in block")
                qr-code-general(v-if="option.id === 'printQRCode'")
                  template(#activator="{ generatePdf }")
                    list-item(class="text-body2 text-primary px-7" @click="generatePdf([material])") {{option.name}}
                qr-code-a4(v-else-if="option.id === 'printCard'")
                  template(#activator="{ generatePdf }")
                    list-item(class="text-body2 text-primary px-7" @click="generatePdf([material])") {{option.name}}
                list-item(
                  v-else
                  class="text-body2 text-primary px-7"
                  @click="handleClick(option)"
                ) {{option.name}}
              div(class="mx-2 my-1" :class="{'border-b': index !== options.length - 1}")
  div(class="text-primary font-bold text-body1 line-clamp-1 line-height-1.6 mt-2") {{material.materialNo}}
</template>

<script>
import { ref, computed } from '@vue/runtime-core'
import useAssets from '@/composables/useAssets'
import useMaterial from '@/composables/useMaterial'
import QrCodeA4 from '@/components/qrcode/QrCodeA4'
import QrCodeGeneral from '@/components/qrcode/QrCodeGeneral'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'GridItem',
  components: { QrCodeA4, QrCodeGeneral },
  props: {
    material: {
      type: Object
    },
    selectedList: {
      type: Array,
      required: true
    }
  },
  setup (props, { emit }) {
    const { goToAssetMaterialDetail } = useNavigation()
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
    } = useAssets()
    const { currentCoverImg, neverScanBefore, materialInfo } = useMaterial(props.material)
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

    const randomKey = ref(0)
    const isHover = ref(false)

    const innerSelectedList = computed({
      get: () => props.selectedList,
      set: (v) => emit('update:selectedList', v)
    })

    const haveSelectedMoreThanOne = computed(() => props.selectedList.length > 0)

    const handleClick = (option) => {
      option.func && option.func(props.material)
    }

    const handleMouseEnter = () => {
      isHover.value = true
      randomKey.value++
    }

    return {
      innerSelectedList,
      options,
      randomKey,
      handleClick,
      handleMouseEnter,
      currentCoverImg,
      neverScanBefore,
      isHover,
      haveSelectedMoreThanOne,
      materialInfo,
      goToAssetMaterialDetail
    }
  }
}
</script>
