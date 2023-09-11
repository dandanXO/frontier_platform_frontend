<template lang="pug">
div(class="text-grey-600 flex flex-col gap-3.5")
  f-tooltip-standard(
    v-for="item in [editMaterial, printCard, downloadU3M]"
    :key="item.id"
    class="cursor-pointer"
    boundaryReference="search-table-header"
    :tooltipMessage="getValueByMaterial(item.name, props.material)"
  )
    template(#slot:tooltip-trigger)
      div(
        v-if="item.id === 'downloadU3M' && getValueByMaterial(item.disabled, props.material)"
        class="w-7.5 h-7.5 flex justify-center items-center text-grey-250"
      )
        f-svg-icon(:iconName="item.icon" size="24")
      div(
        v-else
        class="w-7.5 h-7.5 hover:bg-primary-400/10 hover:text-primary-400 flex justify-center items-center rounded-full"
        @click="item.func && item.func(material)"
      )
        f-svg-icon(:iconName="item.icon" size="24")
  f-popper(class="cursor-pointer" placement="left-start")
    template(#trigger)
      f-tooltip-standard(
        :tooltipMessage="$t('RR0260')"
        boundaryReference="search-table-header"
      )
        template(#slot:tooltip-trigger)
          div(
            class="w-7.5 h-7.5 hover:bg-primary-400/10 hover:text-primary-400 flex justify-center items-center rounded-full"
          )
            f-svg-icon(iconName="more_horiz" size="24")
    template(#content="{ collapsePopper }")
      f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
</template>

<script setup>
import { computed } from 'vue'
import useAssetsOld from '@/composables/useAssetsOld'

const props = defineProps({
  material: {
    type: Object,
    required: true,
  },
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
  deleteMaterial,
} = useAssetsOld()

const optionList = [
  [cloneTo, addToWorkspace],
  [create3DMaterial, exportExcel, printQRCode],
  [deleteMaterial],
]

const getValueByMaterial = (value, material) => {
  if (typeof value === 'function') return value(material)
  return value
}

const menuTree = computed(() => ({
  blockList: optionList.map((block) => ({
    menuList: block.map((option) => ({
      title: getValueByMaterial(option.name, props.material),
      clickHandler: () => option.func(props.material),
      disabled: getValueByMaterial(option.disabled, props.material) || false,
    })),
  })),
}))
</script>
