<template lang="pug">
div(class='flex flex-nowrap gap-12 lg:gap-14 border-b-2 pb-10')
  list-item-img(class='flex-grow' :material='material' :addedMaterialList='addedMaterialList')
  list-item-content(class='flex-shrink-0 flex-grow max-w-240' :material='material')
  list-item-sidebar(class='flex-grow-0' :material='material')
</template>

<script>
import ListItemContent from '@/components/assets/material/list/ListItemContent'
import ListItemImg from '@/components/assets/material/list/ListItemImg'
import ListItemSidebar from '@/components/assets/material/list/ListItemSidebar'
export default {
  name: 'ListItem',
  props: {
    material: {
      type: Object
    },
    addedMaterialList: {
      type: Array
    }
  },
  components: {
    ListItemImg,
    ListItemContent,
    ListItemSidebar
  }
}
</script>
