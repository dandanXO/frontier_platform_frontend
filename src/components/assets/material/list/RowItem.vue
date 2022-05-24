<template lang="pug">
div(class="grid grid-cols-12 max-w-405 gap-12 lg:gap-14 px-14 py-5 hover:bg-black-50")
  row-item-img(:material="material" v-model:selectedList="innerSelectedList" class="col-span-3")
  row-item-content(:material="material" class="col-span-8")
  row-item-sidebar(:material="material" class="col-span-1")
</template>

<script>
import { computed } from 'vue'
import RowItemContent from '@/components/assets/material/list/RowItemContent.vue'
import RowItemImg from '@/components/assets/material/list/RowItemImg.vue'
import RowItemSidebar from '@/components/assets/material/list/RowItemSidebar.vue'

export default {
  name: 'RowItem',
  components: {
    RowItemImg,
    RowItemContent,
    RowItemSidebar
  },
  props: {
    material: {
      type: Object
    },
    selectedList: {
      type: Array,
      required: true
    }
  },
  emits: ['update:selectedList'],
  setup (props, { emit }) {
    const innerSelectedList = computed({
      get: () => props.selectedList,
      set: (v) => emit('update:selectedList', v)
    })

    return {
      innerSelectedList
    }
  }
}
</script>
