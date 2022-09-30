<template lang="pug">
div(class="w-full min-w-42.5 max-w-67.5")
  div(class="pb-2.5 flex justify-between")
    div(class="font-bold text-primary line-clamp-1") {{ material.materialNo }}
    f-svg-icon(:iconName="statusIconName" size="24" class="text-primary")
  div(class="w-full relative aspect-square" @mouseenter="isHover = true" @mouseleave="isHover = false")
    div(class="w-full h-full rounded-md overflow-hidden bg-cover")
      img(v-defaultImg :src="material.coverImg" class="w-full h-full")
    div(v-if="isHover" class="absolute z-9 inset-0 w-full h-full rounded bg-black-900/70" @click.stop="goToAssetMaterialDetail(material)")
    div(v-if="isHover || haveSelectedMoreThanOne" class="absolute z-10 inset-0 w-full h-12")
      div(class="bg-linear w-full h-full rounded-t-md")
      f-input-checkbox(
        v-model:inputValue="innerSelectedList"
        :value="material"
        class="absolute top-3 left-3"
        iconColor="text-black-0"
        uncheckColor="text-black-0"
      )
  div(class="h-6.5 text-primary text-body1 line-clamp-1 mt-2.5") {{ material.description }}
</template>

<script>
import { ref, computed } from '@vue/runtime-core'
import useMaterial from '@/composables/useMaterial'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'RowItemImg',
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
    const isHover = ref(false)
    const { statusIconName } = useMaterial(props.material)

    const innerSelectedList = computed({
      get: () => props.selectedList,
      set: (v) => emit('update:selectedList', v)
    })

    const haveSelectedMoreThanOne = computed(() => props.selectedList.length > 0)

    return {
      innerSelectedList,
      statusIconName,
      isHover,
      haveSelectedMoreThanOne,
      goToAssetMaterialDetail
    }
  }
}
</script>
