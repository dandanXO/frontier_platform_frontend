<template>
  <component
    :is="isDesktop ? Sidebar : Bottombar"
    :textureImages="textureImages"
    :textureType="textureType"
    :originU3m="originU3m"
    :pantoneList="pantoneList"
    :currentColors="currentColors"
    :colorRemovable="colorRemovable"
    :colorAddable="colorAddable"
    :alpha="alpha"
    :roughness="roughness"
    :specular="specular"
    :scale="scale"
    :dpi="dpi"
    :displayMode="displayMode"
    :models="models"
    :currentModel="currentModel"
    @modelClick="$emit('modelClick', $event)"
    @displayModeChange="$emit('displayModeChange', $event)"
    @toggleExpand="$emit('toggleExpand')"
    @textureClick="$emit('textureClick', $event)"
    @colorAdd="$emit('colorAdd')"
    @colorRemove="$emit('colorRemove')"
    @colorChange="(v, index) => $emit('colorChange', v, index)"
    @colorInput="(v, index) => $emit('colorInput', v, index)"
    @alphaChange="$emit('alphaChange', $event)"
    @roughnessChange="$emit('roughnessChange', $event)"
    @specularChange="$emit('specularChange', $event)"
    @scaleChange="$emit('scaleChange', $event)"
    @toggleMoireEffectPrevent="$emit('toggleMoireEffectPrevent')"
  />
</template>

<script setup lang="ts">
import type {
  Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner,
  MaterialU3m,
} from '@frontier/platform-web-sdk'
import type { U3M } from '@/composables/useU3M'
import { useBreakpoints } from '@frontier/lib'
import type { PantoneItem } from '../composables/useColors'
import type { DISPLAY_MODE } from '../constants'
import { defineAsyncComponent } from 'vue'

const Sidebar = defineAsyncComponent(
  () => import('./sidebar/EditorSidebar.vue')
)
const Bottombar = defineAsyncComponent(
  () => import('./bottombar/EditorBottombar.vue')
)
const { isDesktop } = useBreakpoints()

defineProps<{
  originU3m: U3M | undefined
  pantoneList?: { [code: string]: PantoneItem }
  displayMode: DISPLAY_MODE
  currentColors: string[]
  dpi: MaterialU3m['dpi']
  models: Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner[]
  currentModel: Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner
  colorRemovable: boolean
  colorAddable: boolean
  alpha: number
  roughness: number
  specular: number
  scale: number
  textureImages: { [x: number]: string | null }
  textureType: number
}>()

defineEmits<{
  (e: 'displayModeChange', displayMode: DISPLAY_MODE): void
  (e: 'modelClick', modelIndex: number): void
  (e: 'colorAdd'): void
  (e: 'colorRemove'): void
  (e: 'colorChange', v: string, index: number): void
  (e: 'colorInput', v: string, index: number): void
  (e: 'alphaChange', v: number): void
  (e: 'roughnessChange', v: number): void
  (e: 'specularChange', v: number): void
  (e: 'scaleChange', v: number): void
  (e: 'toggleExpand'): void
  (e: 'toggleMoireEffectPrevent'): void
  (e: 'textureClick', textureType: number): void
}>()
</script>
