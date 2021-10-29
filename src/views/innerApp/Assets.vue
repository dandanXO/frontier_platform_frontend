<template lang="pug">
div(class='w-full h-23.5')
  grid-or-row(@change='isGrid = $event' :isGrid='isGrid')
div(v-if='isGrid' class='grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5')
  grid-item(v-for='material in materialList' :material='material')
div(v-else class='grid gap-10 mx-14 lg:mx-20')
  row-item(v-for='material in materialList' :material='material')
multi-select-menu
</template>

<script>
import RowItem from '@/components/assets/material/list/RowItem'
import GridItem from '@/components/assets/material/list/GridItem'
import GridOrRow from '@/components/assets/material/list/GridOrRow'
import MultiSelectMenu from '@/components/assets/material/list/MultiSelectMenu'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'Assets',
  components: {
    RowItem,
    GridItem,
    GridOrRow,
    MultiSelectMenu
  },
  setup () {
    const store = useStore()
    const { location } = useNavigation()
    const isGrid = ref(false)

    store.dispatch('assets/getMaterialList', { location: location.value })

    const materialList = computed(() => store.getters['assets/materialList'])

    return {
      materialList,
      isGrid
    }
  }
}
</script>
