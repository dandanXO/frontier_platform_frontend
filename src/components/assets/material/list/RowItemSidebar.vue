<template lang="pug">
div(class="text-black-700 flex flex-col gap-3.5")
  div(v-if="isShowOverlay" class="fixed" style="width: 4000px; height: 3000px; top: -1500px; left: -2000px; z-index: -1;")
  tooltip(
    v-for="item in iconList"
    class="relative cursor-pointer"
    :placement="item.icon === 'more_horiz' ? 'left-start' : 'left'"
    :showArrow="item.icon !== 'more_horiz'"
    :manual="item.icon === 'more_horiz'"
    :offset="item.icon === 'more_horiz' ? [0, 8] : [0, 12]"
    @show="item.icon === 'more_horiz' && openOverlay()"
    @hide="item.icon === 'more_horiz' && closeOverlay()"
  )
    template(#trigger)
      div(v-if="item.id === 'downloadU3M' && material.u3m.status !== U3M_STATUS.COMPLETED" class="w-7.5 h-7.5 flex justify-center items-center text-black-500")
        svg-icon(:iconName="item.icon" size="24")
      div(v-else class="w-7.5 h-7.5 hover:bg-brand/10 hover:text-brand flex justify-center items-center rounded-full" @click="handleClick(item)")
        svg-icon(:iconName="item.icon" size="24")
    template(#content)
      div(v-if="item.icon !== 'more_horiz'" class="py-3 px-3 text-primary text-caption whitespace-nowrap") {{ item.name }}
      div(v-else class="w-55 py-2.5")
        div(v-for="(block, index) in options" class="text-black-400")
          list-item(v-for="option in block" class="text-body2 text-primary px-7" @click="handleClick(option)")
            template(v-if="option.id === 'create3DMaterial'") {{ material.u3m.status === U3M_STATUS.COMPLETED ? $t('RR0074') : option.name }}
            template(v-else) {{ option.name }}
          div(class="mx-2 my-1" :class="{ 'border-b': index !== options.length - 1 }")
</template>

<script setup>
import useAssets from '@/composables/useAssets'
import { U3M_STATUS } from '@/utils/constants'
import { ref } from 'vue'

const props = defineProps({
  material: {
    type: Object,
    required: true
  }
})

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

const iconList = [
  editMaterial,
  printCard,
  downloadU3M,
  { icon: 'more_horiz' }
]

const options = [
  [
    cloneTo,
    addToWorkspace
  ],
  [
    create3DMaterial,
    exportExcel,
    printQRCode
  ],
  [
    deleteMaterial
  ]
]

const isShowOverlay = ref(false)
const openOverlay = () => { isShowOverlay.value = true }
const closeOverlay = () => { isShowOverlay.value = false }
const handleClick = (option) => {
  option.func && option.func(props.material)
}
</script>
