<template lang="pug">
div(class="text-grey-600 flex flex-col gap-3.5")
  f-tooltip-standard(
    v-for="item in permanentList"
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
import { useStore } from 'vuex'
import useAssets, { type AssetsFunctionOption } from '@/composables/useAssets'
import type { MenuTree } from '@frontier/ui-component'
import type { Material } from '@frontier/platform-web-sdk'
import { PERMISSION_MAP, FUNC_ID } from '@/utils/constants'

const store = useStore()
const props = defineProps<{
  material: Material
}>()

const {
  editMaterial,
  downloadU3m,
  cloneTo,
  addToWorkspace,
  createU3m,
  // exportExcel,
  printLabel,
  printA4Swatch,
  deleteMaterial,
} = useAssets()
const roleId = computed(
  () => store.getters['organization/orgUser/orgUser'].roleID
)

const permanentList = computed<AssetsFunctionOption[]>(
  (): AssetsFunctionOption[] => {
    const list = [printA4Swatch, downloadU3m]

    const permissionList = PERMISSION_MAP[roleId.value]
    if (permissionList.includes(FUNC_ID.ASSET_EDIT)) {
      list.unshift(editMaterial)
    }
    return list
  }
)

const menuTree = computed<MenuTree>(() => {
  // Map each permission ID to its corresponding handler function
  const permissionHandlerMap = {
    [FUNC_ID.ASSET_COPY]: () => funcOneList.push(cloneTo),
    [FUNC_ID.ASSET_ADD_TO_WORK_SPACE]: () => funcOneList.push(addToWorkspace),
    [FUNC_ID.ASSETS_3DVIEWER_EDIT]: () => funTwoList.unshift(createU3m),
    [FUNC_ID.ASSET_DELETE]: () => optionList.push([deleteMaterial]),
  }

  const funcOneList: AssetsFunctionOption[] = []
  const funTwoList: AssetsFunctionOption[] = [printLabel]
  const optionList: AssetsFunctionOption[][] = [funTwoList]

  // Assume permissionList is an array of permission IDs.
  const permissionList: number[] = PERMISSION_MAP[roleId.value]

  //1 Iterate over the permission list in a single pass and execute the corresponding handlers.
  permissionList.forEach((permission) => {
    if (permissionHandlerMap[permission]) {
      permissionHandlerMap[permission]()
    }
  })

  // 2) If funcOneList was updated in the previous step, add it to the beginning of optionList.

  if (funcOneList.length > 0) {
    optionList.unshift(funcOneList)
  }

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
