<template lang="pug">
div(class="text-grey-600 flex flex-col gap-3.5")
  f-tooltip-standard(
    v-for="item in [editMaterial, printA4Swatch, downloadU3m]"
    :key="item.id"
    class="cursor-pointer"
    boundaryReference="search-table-header"
    :tooltipMessage="item.name(material)"
  )
    template(#slot:tooltip-trigger)
      div(
        class="w-7.5 h-7.5 flex justify-center items-center"
        :class="[item.disabled && item.disabled(material) ? 'text-grey-250 cursor-default' : 'hover:bg-primary-400/10 hover:text-primary-400 rounded-full']"
        @click="clickHandler(item)"
      )
        f-svg-icon(v-if="item.icon" :iconName="item.icon(material)" size="24")
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

<script setup lang="ts">
import { computed } from 'vue'
import useAssets, { type AssetsFunctionOption } from '@/composables/useAssets'
import type { MenuTree } from '@frontier/ui-component'
import type { Material } from '@frontier/platform-web-sdk'

const props = defineProps<{
  material: Material
}>()

const {
  editMaterial,
  downloadU3m,
  cloneTo,
  addToWorkspace,
  createU3m,
  exportExcel,
  printLabel,
  printA4Swatch,
  deleteMaterial,
} = useAssets()

const menuTree = computed<MenuTree>(() => {
  const optionList = [
    [cloneTo, addToWorkspace],
    [createU3m, exportExcel, printLabel],
    [deleteMaterial],
  ]

  return {
    blockList: optionList.map((block) => ({
      menuList: block.map((option) => ({
        title: option.name(props.material),
        clickHandler: () => option.func(props.material),
        disabled: option.disabled ? option.disabled(props.material) : false,
      })),
    })),
  }
})

const clickHandler = (item: AssetsFunctionOption) => {
  if (item.disabled && item.disabled(props.material)) {
    return
  }

  item.func(props.material)
}
</script>
