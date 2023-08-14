<template lang="pug">
div(class="w-screen h-screen fixed inset-0 bg-grey-0 z-50")
  div(class="flex justify-between items-center px-30 py-3 z-40 bg-grey-0 shadow-4")
    img(
      class="w-10 h-10"
      src="https://www.heuritech.com/wp-content/uploads/2021/03/heuritech_min.svg"
    )
    button(
      class="rounded text-grey-100 px-4 py-1.5 bg-heuritech"
      @click="$emit('close')"
    ) Exit
  div(class="h-[calc(100%_-_64px)] flex gap-x-5 pl-18")
    div(class="w-1/6 overflow-y-auto hide-scrollbar py-5")
      div(
        v-for="material in materialList"
        :key="material.frontierNo"
        :ref="(el) => carouselList.push({ frontierNo: material.frontierNo, element: el })"
      )
        div(
          class="aspect-square rounded overflow-hidden shadow-4 cursor-pointer"
          :class="[currentFrontierNo === material.frontierNo ? 'border-[4px] border-heuritech' : 'border border-grey-200']"
          @click="currentFrontierNo = material.frontierNo"
        )
          img(:src="material.coverImg" class="w-full h-full object-cover")
        span(class="text-body2") {{ material.frontierNo }}
    div(class="w-5/6 overflow-y-auto")
      div(class="pt-5 pr-18 h-full")
        div(v-if="isFetching" class="h-full flex items-center justify-center")
          f-svg-icon(iconName="loading" class="text-heuritech" size="120")
        div(v-else class="w-4/5 h-fit mx-auto pb-10")
          template(v-if="material")
            material-detail-external(
              :key="material.frontierNo"
              :material="material"
              :isCanDownloadU3M="true"
            )
</template>

<script setup lang="ts">
import MaterialDetailExternal from '@/components/material/detail/MaterialDetailExternal.vue'

import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import type { Material } from '@frontier/platform-web-sdk'
import { getMaterial } from '@/apis'

defineEmits<{
  (e: 'close'): void
}>()

const props = defineProps<{
  materialList: {
    frontierNo: string
    coverImg: string
  }[]
  initialFrontierNo: string
}>()

const currentFrontierNo = ref(props.initialFrontierNo)

const isFetching = ref(false)
const material = ref<Material>()

watchEffect(async () => {
  isFetching.value = true
  const response = await getMaterial(currentFrontierNo.value)
  material.value = response.data.result.material as Material
  isFetching.value = false
})

const isScrolling = ref(false)
const checkIfScrolling = () => {
  isScrolling.value = document.querySelector('html')!.scrollTop > 0
}

const carouselList = ref<
  {
    frontierNo: string
    element: HTMLElement
  }[]
>([])

onMounted(() => {
  window.addEventListener('scroll', checkIfScrolling)
  const selectedMaterialElement = carouselList.value.find(
    (item) => item.frontierNo === props.initialFrontierNo
  )
  selectedMaterialElement?.element.scrollIntoView()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkIfScrolling)
})
</script>
