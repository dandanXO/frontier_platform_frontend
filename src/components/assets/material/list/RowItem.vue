<template lang="pug">
div(class='grid grid-cols-12 max-w-405 gap-12 lg:gap-14 px-14 py-5 hover:bg-black-50')
  row-item-img(:material='material' class='col-span-3')
  row-item-content(:material='material' class='col-span-8 max-w-240')
  row-item-sidebar(:material='material' class='col-span-1')
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
    }
  },
  components: {
    RowItemImg,
    RowItemContent,
    RowItemSidebar
  }
}
</script>
