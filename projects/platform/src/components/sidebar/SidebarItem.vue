<template lang="pug">
div(
  class="flex items-center gap-x-2 h-9 pl-3 pr-2 hover:bg-grey-100 cursor-pointer"
  :class="[{ 'bg-grey-150': isActive }, { 'pointer-events-none': disabled }]"
  @click="innerGoTo"
)
  slot
    f-svg-icon(
      v-if="icon"
      :iconName="icon"
      size="20"
      :class="[disabled ? 'text-grey-250' : 'text-grey-600']"
    )
    span(
      class="text-body2 line-clamp-1"
      :class="[disabled ? 'text-grey-250' : 'text-grey-900']"
    ) {{ title }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps<{
  id: string
  title?: string
  icon?: string
  disabled?: boolean
  goTo?: () => any
  ogKey?: string
}>()

const store = useStore()
const route = useRoute()

const isActive = computed(() => {
  if (props.ogKey) {
    return (
      (route.path as string).includes(props.ogKey) &&
      (route.name as string).includes(props.id)
    )
  }
  return (route.name as string).includes(props.id)
})

const innerGoTo = async () => {
  if (props.disabled || !props.goTo) {
    return
  }
  try {
    await store.dispatch('sticker/closeStickerDrawer')
    await props.goTo()
  } catch (err) {
    console.error(err)
    // cancel to switch page
  }
}
</script>
