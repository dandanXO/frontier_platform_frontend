<template lang="pug">
div(class="h-full pt-5 px-7.5 pb-2.5 text-body2" :key="material.itemNo")
  div(class="text-grey-900 font-bold pb-3") {{ material.itemNo }}
  div(class="grid grid-cols-2 grid-rows-5 gap-x-10 gap-y-1.5 grid-flow-col")
    div(
      v-for="item in specificationInfoList"
      :key="item.name"
      class="col-span-1 line-clamp-1 !text-body2/1.6"
    ) {{ item.name }}: {{ item.value }}
</template>

<script setup lang="ts">
import useMaterial from '@/composables/material/useMaterial'
import type { Material } from '@frontier/platform-web-sdk'
import { ref, computed } from 'vue'

const props = defineProps<{
  material: Material
}>()

const { specificationInfo } = useMaterial(ref(props.material))
const specificationInfoList = computed(() => {
  const { materialType, contentList, width, weight, finishList, construction } =
    specificationInfo.value

  const list: { name: string; value: any }[] = []

  if (materialType) {
    list.push(materialType)
  }

  if (construction && construction.value) {
    Object.keys(construction.value).forEach((key) => {
      if (construction.value) {
        list.push(construction.value[key])
      }
    })
  }

  if (contentList) {
    list.push(contentList)
  }

  if (width) {
    list.push(width)
  }

  if (weight) {
    list.push(weight)
  }

  if (finishList) {
    list.push(finishList)
  }

  return list
})
</script>
