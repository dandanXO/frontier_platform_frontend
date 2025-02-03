<template>
  <model-list
    @modelClick="$emit('modelClick', $event)"
    :models="models"
    :currentModel="currentModel"
    :itemSize="12"
    classContainer="flex flex-row  gap-4 m-auto overflow-x-scroll w-420 max-w-full"
    v-if="displayMode === DISPLAY_MODE.MODEL"
  />
  <texture-list
    v-else
    :textureImages="textureImages"
    :textureType="textureType"
    @textureClick="$emit('textureClick', $event)"
  />
</template>

<script setup lang="ts">
import type { Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner } from '@frontier/platform-web-sdk'
import { DISPLAY_MODE } from '../../constants'
import ModelList from '../ModelList.vue'
import TextureList from '../TextureList.vue'

defineProps<{
  models: Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner[]
  currentModel: Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner
  displayMode: DISPLAY_MODE
  textureImages: { [x: number]: string | null }
  textureType: number
}>()
defineEmits<{
  (e: 'modelClick', modelIndex: number): void
  (e: 'textureClick', textureType: number): void
}>()
</script>
