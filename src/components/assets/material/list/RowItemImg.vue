<template lang="pug">
div(class="w-full min-w-42.5 max-w-67.5")
  div(class="pb-2.5 flex justify-between")
    div(class="font-bold text-primary line-clamp-1") {{material.materialNo}}
    svg-icon(:iconName="statusIconName" size="24" class="text-primary")
  div(
    class="relative aspect-ratio rounded bg-black-200 border-block-400 bg-cover mb-2.5 overflow-hidden"
    :class="{'border': neverScanBefore }"
    @mouseenter="active = true"
    @mouseleave="active = false"
  )
    img(:src="currentCoverImg" class="w-full h-full")
    input-checkbox(
      v-if="active || checked"
      v-model:inputValue="innerSelectedList"
      :value="JSON.stringify(material)"
      class="absolute z-10 top-3 left-3 cursor-pointer"
      iconColor="text-black-0"
    )
    div(v-if="active" class="absolute z-9 inset-0 w-full h-full rounded bg-opacity-70 bg-black-900" @click.stop="goToAssetMaterialDetail(material)")
  div(class="h-6.5 text-primary text-body1 line-clamp-1 line-height-1.6") {{material.description}}
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
    const active = ref(false)
    const { currentCoverImg, neverScanBefore, statusIconName } = useMaterial(props.material)

    const innerSelectedList = computed({
      get: () => props.selectedList,
      set: (v) => emit('update:selectedList', v)
    })

    const checked = computed(() => props.selectedList.includes(JSON.stringify(props.material)))

    return {
      innerSelectedList,
      statusIconName,
      currentCoverImg,
      neverScanBefore,
      active,
      checked,
      goToAssetMaterialDetail
    }
  }
}
</script>
