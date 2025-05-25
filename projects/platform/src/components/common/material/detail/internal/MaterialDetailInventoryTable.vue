<template lang="pug">
div(class="w-full table-fixed overflow-x-auto")
  div(class="min-w-[700px]")
    div(class="bg-secondary rounded-t-lg")
      div(class="grid content-center text-left" :class="[classGridCols]")
        div(
          v-for="header in headerList"
          :key="header.prop"
          class="text-sm text-primary-inverse p-3 font-bold"
        ) {{ header.label }}
    div(class="divide-y divide-solid divide-tertiary-border")
      div(
        v-for="(item, index) in itemList"
        :key="`item-${index}`"
        class="grid items-center text-left p-3"
        :class="[classGridCols]"
      )
        div(
          v-for="header in headerList"
          :key="header.prop"
          class="text-sm primary-inverse line-clamp-2 !break-normal"
        ) {{ item[header.prop] }}
</template>

<script setup lang="ts">
defineProps<{
  headerList: { prop: string; label: string }[]
  itemList: { [key: string]: string | number | null }[]
  classGridCols: string // Tailwindcss e.g. 'grid-cols-7'
}>()
</script>
