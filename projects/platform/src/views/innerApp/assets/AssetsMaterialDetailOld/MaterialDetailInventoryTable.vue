<template lang="pug">
div(class="w-fit table-fixed")
  div(class="bg-grey-150 w-full")
    div(
      class="h-7.5 grid gap-x-10 content-center px-10 text-left"
      :class="[classGridCols]"
    )
      div(
        v-for="header in headerList"
        :key="header.prop"
        class="font-normal max-w-19 text-body2/1.6 text-grey-800"
      ) {{ header.label }}
  div(class="divide-y divide-solid divide-grey-150")
    div(
      v-for="(item, index) in itemList"
      :key="`item-${index}`"
      class="grid items-center gap-x-10 content-center px-10 py-2.5 text-left"
      :class="[classGridCols]"
    )
      div(
        v-for="header in headerList"
        :key="header.prop"
        class="text-body2/1.6 text-grey-900"
      ) {{ item[header.prop] }}
</template>

<script setup lang="ts">
defineProps<{
  headerList: { prop: string; label: string }[]
  itemList: { [key: string]: string | number | null }[]
  classGridCols: string // Tailwindcss e.g. 'grid-cols-7'
}>()
</script>
