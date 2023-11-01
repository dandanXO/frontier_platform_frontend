<template lang="pug">
f-breadcrumb(
  :breadcrumbList="breadcrumbList"
  :fontSize="fontSize"
  @click:item="clickMenuHandler"
)
</template>

<script lang="ts">
export default {
  name: 'GlobalBreadcrumbList',
}
</script>

<script setup lang="ts">
import { useStore } from 'vuex'

interface BreadcrumbItem {
  name: string
  path?: string
  goTo?: () => void
  [key: string]: any
}

withDefaults(
  defineProps<{
    breadcrumbList: BreadcrumbItem[]
    fontSize?: string
  }>(),
  {
    fontSize: 'text-body1',
  }
)

const emits = defineEmits<{
  (e: 'click:item', item: BreadcrumbItem): void
}>()

const store = useStore()

const clickMenuHandler = async (item: BreadcrumbItem) => {
  await store.dispatch('sticker/closeStickerDrawer')
  emits('click:item', item)
}
</script>
