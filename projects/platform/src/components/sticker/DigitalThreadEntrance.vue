<template lang="pug">
f-tooltip-standard(
  @click.stop="store.dispatch('sticker/preOpenStickerDrawer', { material, drawerOpenFromLocationList })"
  :tooltipMessage="$t('TT0001')"
)
  template(#slot:tooltip-trigger)
    div(
      class="relative cursor-pointer w-12 h-7.5 rounded border border-grey-150 bg-grey-0 hover:bg-grey-100 text-grey-600 flex items-center justify-center gap-x-2"
      :class="[{ '!bg-primary-50 !text-primary-400': currentMaterialId === material.materialId }]"
    )
      f-svg-icon(iconName="sticker_thread" size="20")
      span(class="text-caption font-bold") {{ material.digitalThreadInfo.threadQty }}
      div(
        v-if="material.digitalThreadInfo.hasUnreadThread"
        class="w-2 h-2 rounded-full bg-primary-400 absolute -top-0.5 -right-0.5"
      )
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed } from 'vue'
import type { Material, MainMaterial } from '@frontier/platform-web-sdk'

defineProps<{
  material: Material | MainMaterial
  drawerOpenFromLocationList: string[]
}>()

const store = useStore()

const currentMaterialId = computed(
  () => store.getters['sticker/currentMaterialId']
)
</script>
