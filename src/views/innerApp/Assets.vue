<template lang="pug">
div(class='w-full h-23.5')
  button(@click='isList = !isList') change status
div(v-if='isList' class='grid gap-10 mx-14 lg:mx-20')
  list-item(v-for='material in materialList'
  :material='material'
  :addedMaterialList='addedMaterialList'
)
div(v-else class='flex flex-wrap gap-y-6 gap-x-5 mx-7.5')
  gallery-item(
    v-for='material in materialList'
    :material='material'
    :addedMaterialList='addedMaterialList'
  )
</template>

<script>
import ListItem from '@/components/assets/material/list/ListItem'
import GalleryItem from '@/components/assets/material/list/GalleryItem'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'Assets',
  components: {
    ListItem,
    GalleryItem
  },
  setup () {
    const store = useStore()
    const { location } = useNavigation()

    store.dispatch('assets/getMaterialList', { location: location.value })

    const materialList = computed(() => store.getters['assets/materialList'])

    const isList = ref(true)
    const addedMaterialList = ref([])

    return {
      materialList,
      isList,
      addedMaterialList
    }
  }
}
</script>
