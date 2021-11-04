<template lang="pug">
div(class='w-full min-w-42.5 max-w-67.5')
  div(class='pb-2.5 flex justify-between')
    div(class="font-bold text-primary") {{material.materialNo}}
    svg-icon(:iconName='statusIconName' size='24' class="text-primary")
  div(
    class='relative aspect-ratio rounded bg-black-200 border-block-400 bg-cover mb-2.5 overflow-hidden'
    :class="{'border': neverScanBefore }"
    @mouseenter="active = true"
    @mouseleave="active = false"
  )
    img(:src="currentCoverImg" class="w-full h-full")
    input-checkbox(
      v-if='active || checked'
      v-model:inputValue='addedMaterialList'
      :value='material'
      class='absolute z-10 top-3 left-3 cursor-pointer'
      iconColor='text-black-0'
    )
    div(v-if="active" class='absolute z-9 inset-0 w-full h-full rounded bg-opacity-70 bg-black-900')
  div(class='text-primary text-body1 line-clamp-1 line-height-1.6') {{material.description}}
</template>

<script>
import { ref, computed } from '@vue/runtime-core'
import useMaterial from '@/composables/useMaterial'
import { useStore } from 'vuex'

export default {
  name: 'RowItemImg',
  props: {
    material: {
      type: Object
    }
  },
  setup (props) {
    const store = useStore()
    const active = ref(false)
    const { currentCoverImg, neverScanBefore, statusIconName } = useMaterial(props.material)

    const addedMaterialList = computed({
      get: () => store.getters['assets/addedMaterialList'],
      set: (v) => store.commit('assets/SET_addedMaterialList', v)
    })

    const checked = computed(() => addedMaterialList.value.includes(props.material))

    return {
      addedMaterialList,
      statusIconName,
      currentCoverImg,
      neverScanBefore,
      active,
      checked
    }
  }
}
</script>
