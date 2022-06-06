<template lang="pug">
div(class="w-full")
  div(
    class="relative aspect-square"
    @mouseenter="handleMouseEnter"
    @mouseleave="isHover = false"
  )
    div(class="w-full h-full rounded overflow-hidden bg-cover" :class="{ 'border': neverScanBefore }")
      img(:src="currentCoverImg" class="w-full h-full")
    div(v-if="isHover || haveSelectedMoreThanOne" class="absolute z-10 inset-0 w-full h-12")
      div(class="bg-linear w-full h-full rounded-t-md")
      input-checkbox(
        v-model:inputValue="innerSelectedList"
        :value="JSON.stringify(material)"
        class="absolute top-3 left-3"
        iconColor="text-black-0"
        uncheckColor="text-black-0"
      )
    div(v-show="isHover" class="absolute z-9 inset-0 w-full h-full rounded bg-black-900/70")
      div(class="text-black-0 px-7.5 py-10 h-full flex flex-col items-center justify-center text-center" @click.stop="goToAssetMaterialDetail(material)")
        div(class="text-body2 font-bold line-clamp-2 leading-1.6") {{ material.description }}
        div(class="text-caption line-clamp-2 leading-1.6") {{ material.content }}
        div(class="text-caption flex gap-1 leading-1.6")
          div {{ materialInfo.yarn.value }}
          div {{ materialInfo.density.value }}
          div {{ materialInfo.width.value }}
        div(class="text-caption line-clamp-2 leading-1.6") {{ material.finish }}
        div(class="text-caption line-clamp-1 leading-1.6") {{ materialInfo.weight.value }}
      tooltip(
        v-if="innerSelectedList.length === 0"
        class="absolute bottom-3 right-3"
        placement="right-start"
        :showArrow="false"
        :manual="true"
        :offset="[0, 5]"
        :key="randomKey"
      )
        template(#trigger)
          svg-icon(iconName="more_vert" size="20" class="cursor-pointer text-black-500 hover:text-black-200" )
        template(#content)
          div(class="w-55 py-2.5")
            div(v-for="(block, index) in options")
              list-item(
                v-for="option in block"
                class="px-7"
                :disabled="option.disabled"
                @click="handleClick(option)"
              )
                template(v-if="option.id === 'create3DMaterial'") {{ material.u3m.status === U3M_STATUS.COMPLETED ? $t('RR0074') : option.name }}
                template(v-else) {{ option.name }}
              div(class="mx-2 my-1 border-black-400" :class="{ 'border-b': index !== options.length - 1 }")
  div(class="text-primary font-bold text-body1 line-clamp-1 mt-2") {{ material.materialNo }}
</template>

<script setup>
import { ref, computed } from '@vue/runtime-core'
import useAssets from '@/composables/useAssets'
import useMaterial from '@/composables/useMaterial'
import useNavigation from '@/composables/useNavigation'
import { U3M_STATUS } from '@/utils/constants'

const props = defineProps({
  material: {
    type: Object
  },
  selectedList: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:selectedList'])

const { goToAssetMaterialDetail } = useNavigation()
const {
  editMaterial,
  printCard,
  downloadU3M,
  cloneTo,
  addToWorkspace,
  create3DMaterial,
  exportExcel,
  printQRCode,
  deleteMaterial
} = useAssets()
const { currentCoverImg, neverScanBefore, materialInfo } = useMaterial(props.material)

downloadU3M.disabled = props.material.u3m.status !== U3M_STATUS.COMPLETED

const options = [
  [
    editMaterial
  ],
  [
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
  if (option.disabled) return

  option.func && option.func(props.material)
}

const handleMouseEnter = () => {
  isHover.value = true
  randomKey.value++
}
</script>
