<template lang="pug">
div(class='grid grid-cols-12 max-w-405 gap-12 lg:gap-14 border-b-2 pb-10')
  row-item-img(class='col-span-3' :material='material' :addedMaterialList='addedMaterialList')
  row-item-content(class='col-span-8 max-w-240' :material='material')
  row-item-sidebar(class='col-span-1' :material='material')
</template>

<script>
import RowItemContent from '@/components/assets/material/list/RowItemContent'
import RowItemImg from '@/components/assets/material/list/RowItemImg'
import RowItemSidebar from '@/components/assets/material/list/RowItemSidebar'
export default {
  name: 'RowItem',
  props: {
    material: {
      type: Object
    },
    addedMaterialList: {
      type: Array
    }
  },
  components: {
    RowItemImg,
    RowItemContent,
    RowItemSidebar
  }
}
</script>
