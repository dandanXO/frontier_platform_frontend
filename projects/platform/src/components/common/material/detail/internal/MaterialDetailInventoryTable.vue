<template lang="pug">
table(class="w-fit table-fixed")
  thead(class="bg-grey-150 w-full")
    tr(
      class="h-7.5 grid gap-x-10 content-center px-10 text-left"
      :class="[classGridCols]"
    )
      th(
        v-for="header in headerList"
        :key="header.prop"
        class="font-normal max-w-19 text-body2/1.6 text-grey-800"
      ) {{ header.label }}
  tbody(class="divide-y divide-solid divide-grey-150")
    tr(
      v-for="(item, index) in itemList"
      :key="`item-${index}`"
      class="grid items-center gap-x-10 content-center px-10 text-left"
      :class="[classGridCols]"
    )
      td(
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
