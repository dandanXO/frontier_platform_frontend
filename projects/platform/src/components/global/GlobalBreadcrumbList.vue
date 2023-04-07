<template lang="pug">
f-breadcrumb(
  :breadcrumbList="breadcrumbList"
  :fontSize="fontSize"
  @click:item="clickMenuHandler"
)
</template>

<script>
export default {
  name: 'GlobalBreadcrumbList',
  inheritAttrs: false,
}
</script>

<script setup>
import { useStore } from 'vuex'

defineProps({
  breadcrumbList: {
    type: Array,
    required: true,
  },
  fontSize: {
    type: String,
    default: 'text-body1',
  },
})
const emit = defineEmits(['click:item'])
const store = useStore()

const clickMenuHandler = async (item) => {
  await store.dispatch('sticker/closeStickerDrawer')
  emit('click:item', item)
}
</script>
