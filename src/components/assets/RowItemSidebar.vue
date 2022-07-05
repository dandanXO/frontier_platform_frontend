<template lang="pug">
div(class="text-black-700 flex flex-col gap-3.5")
  tooltip(v-for="item in [editMaterial, printCard, downloadU3M]" class="cursor-pointer" placement="left")
    template(#trigger)
      div(v-if="item.id === 'downloadU3M' && material.u3m.status !== U3M_STATUS.COMPLETED" class="w-7.5 h-7.5 flex justify-center items-center text-black-500")
        svg-icon(:iconName="item.icon" size="24")
      div(v-else class="w-7.5 h-7.5 hover:bg-brand/10 hover:text-brand flex justify-center items-center rounded-full" @click="handleClick(item)")
        svg-icon(:iconName="item.icon" size="24")
    template(#content)
      div(class="py-3 px-3 text-primary text-caption whitespace-nowrap") {{ item.name }}
  popper(class="cursor-pointer" placement="left-start")
    template(#trigger)
      div(class="w-7.5 h-7.5 hover:bg-brand/10 hover:text-brand flex justify-center items-center rounded-full")
        svg-icon(iconName="more_horiz" size="24")
    template(#content="{ collapsePopper }")
      list(class="w-55")
        div(v-for="(block, index) in optionList" class="text-black-400")
          list-item(v-for="option in block" class="text-body2 text-primary px-7" @click="handleClick(option); collapsePopper()")
            template(v-if="option.id === 'create3DMaterial'") {{ material.u3m.status === U3M_STATUS.COMPLETED ? $t('RR0074') : option.name }}
            template(v-else) {{ option.name }}
          div(class="mx-2 my-1" :class="{ 'border-b': index !== optionList.length - 1 }")
</template>

<script setup>
import useAssets from '@/composables/useAssets'
import { U3M_STATUS } from '@/utils/constants'

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

const optionList = [
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

const handleClick = (option) => {
  option.func && option.func(props.material)
}
</script>
