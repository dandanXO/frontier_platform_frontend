<template lang="pug">
div
  div(class="aspect-square")
    img(v-if="!!imageList[currentDisplayIndex].src" class="w-full h-full" :src="imageList[currentDisplayIndex].src")
    div(v-else class="rounded w-full h-full border border-black-400 bg-black-200 flex items-center justify-center text-h4 font-bold text-black-400") {{ $t("RR0103") }}
  div(class="flex pt-3 pb-4")
    p(v-for="text in imageList[currentDisplayIndex].text" class="text-caption text-center font-bold") {{ text }}
  div(class="grid grid-flow-col gap-x-2 justify-start")
    div(v-for="(image, index) in imageList" @click="currentDisplayIndex = index")
      div(class="w-19.5 h-19.5 rounded overflow-hidden border-black-400 bg-black-200" :class="[currentDisplayIndex === index ? 'border-4' : 'border']")
        template(v-if="!!image.src")
          img(class="w-full h-full" :src="image.src")
</template>

<script>
import useMaterial from '@/composables/useMaterial'
import { ref } from 'vue'

export default {
  name: 'BlockMaterialPreviewImg',
  props: {
    material: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { imageList, defaultCoverImgIndex } = useMaterial(props.material)
    const currentDisplayIndex = ref(defaultCoverImgIndex.value)

    return {
      imageList,
      currentDisplayIndex
    }
  }
}
</script>
