<template lang="pug">
div(class="pt-10 px-25 h-full grid grid-cols-4 gap-x-2 justify-center items-center")
  clothes-Image(
    v-for="clothes in clothesList"
    v-bind="clothes"
    :key="clothes.title"
  )
</template>

<script setup lang="ts">
import clothesJSON from '@/assets/clothes.json'
import type { Clothes } from '@/types'
import ClothesImage from '@/components/ClothesImage.vue'

const clothesList: Clothes[] = clothesJSON
</script>
