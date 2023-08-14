<template lang="pug">
div(class="mx-auto")
  img(:src="imageUrl" :usemap="'#' + mapName" class="object-contain object-center")
  map(:name="mapName")
    //- https://www.image-map.net/
    area(
      v-for="(area, index) in mapAreaList"
      :key="`${area.color}-${index}`"
      :title="area.color"
      :alt="area.color"
      :coords="area.coords"
      shape="poly"
      @click="goToClothesDetail(area.color)"
      class="cursor-pointer"
    )
</template>

<script setup lang="ts">
import type { Clothes } from '@/types'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import imageMapResize from 'image-map-resizer'

const props = defineProps<Clothes>()

const router = useRouter()

const imageUrl = new URL(
  `/src/assets/images/${props.clothesId}/${props.clothesId}.png`,
  import.meta.url
).href

const mapName = ref('image-map-' + props.clothesId)

const goToClothesDetail = (color: string) => {
  router.push(`/clothes/${props.clothesId}?color=${color}`)
}

onMounted(() => {
  imageMapResize()
})
</script>
