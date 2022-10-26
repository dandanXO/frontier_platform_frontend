<template lang="pug">
div(class="text-grey-600 flex flex-col gap-3.5")
  f-tooltip(
    v-for="item in [editMaterial, printCard, downloadU3M]"
    class="cursor-pointer"
    boundaryReference="search-table-header"
  )
    template(#trigger)
      div(
        v-if="item.id === 'downloadU3M' && material.u3m.status !== U3M_STATUS.COMPLETED"
        class="w-7.5 h-7.5 flex justify-center items-center text-grey-200"
      )
        f-svg-icon(:iconName="item.icon" size="24")
      div(
        v-else
        class="w-7.5 h-7.5 hover:bg-primary-400/10 hover:text-primary-400 flex justify-center items-center rounded-full"
        @click="item.func && item.func(material)"
      )
        f-svg-icon(:iconName="item.icon" size="24")
    template(#content)
      p {{ item.name }}
  f-popper(class="cursor-pointer" placement="left-start")
    template(#trigger)
      div(
        class="w-7.5 h-7.5 hover:bg-primary-400/10 hover:text-primary-400 flex justify-center items-center rounded-full"
      )
        f-svg-icon(iconName="more_horiz" size="24")
    template(#content="{ collapsePopper }")
      f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
</template>

<script setup>
import useAssets from '@/composables/useAssets'
import { U3M_STATUS } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
} = useAssets()

const menuTree = {
  blockList: [
    {
      menuList: [
        {
          title: cloneTo.name,
          clickHandler: cloneTo.func.bind(undefined, props.material),
        },
        {
          title: addToWorkspace.name,
          clickHandler: addToWorkspace.func.bind(undefined, props.material),
        },
      ],
    },
    {
      menuList: [
        {
          title:
            props.material.u3m.status === U3M_STATUS.COMPLETED
              ? t('RR0074')
              : create3DMaterial.name,
          clickHandler: create3DMaterial.func.bind(undefined, props.material),
        },
        {
          title: exportExcel.name,
          clickHandler: exportExcel.func.bind(undefined, props.material),
        },
        {
          title: printQRCode.name,
          clickHandler: printQRCode.func.bind(undefined, props.material),
        },
      ],
    },
    {
      menuList: [
        {
          title: deleteMaterial.name,
          clickHandler: deleteMaterial.func.bind(undefined, props.material),
        },
      ],
    },
  ],
}
</script>
