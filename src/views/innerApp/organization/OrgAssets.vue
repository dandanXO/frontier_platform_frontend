<template lang="pug">
div(class='w-full h-23.5')
  button(@click='isList = !isList') change status
div(v-if='isList' class='grid gap-10 mx-14 lg:mx-20')
  list-item(v-for='material in list'
  :material='material'
  :addedMaterialList='addedMaterialList'
)
div(v-else class='flex flex-wrap gap-y-6 gap-x-5 mx-7.5')
  gallery-item(
    v-for='material in list'
    :material='material'
    :addedMaterialList='addedMaterialList'
  )
</template>

<script>
import ListItem from '@/components/assets/material/list/ListItem'
import GalleryItem from '@/components/assets/material/list/GalleryItem'
import materialList from '@/mocks/seeds/material-list'
import { ref } from 'vue'

export default {
  name: 'OrgAssets',
  components: { ListItem, GalleryItem },
  setup () {
    const list = materialList
    const isList = ref(true)
    const addedMaterialList = ref([])

    return {
      list,
      isList,
      addedMaterialList
    }
  }
}
</script>
