<script lang="ts" setup>
import { computed, ref } from 'vue'
import 'vue3-carousel/dist/carousel.css'
import useScene from '../composables/useScene'
import useModels from '../composables/useModels'
import useU3M from '../composables/useU3M'
import useColors from '../composables/useColors'
import useKeyboard from '../composables/useKeyboard'
import EditorHeader from './EditorHeader.vue'
import EditorSidebar from './EditorSidebar.vue'
import EditorLoader from './EditorLoader.vue'
import { DISPLAY_MODE, TEXTURE_TYPE } from '../constants'

const props = defineProps<{
  u3mPath: string
  dpi: number
  baseImgUrl: string
  normalImgUrl: string
  dispImgUrl: string
  roughImgUrl: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { VITE_APP_WEB_URL } = import.meta.env
const baseUrl = VITE_APP_WEB_URL + '/static-data/material'

const loading = ref(true)

const { scene, canvas, takeScreenShot } = useScene(baseUrl)
const {
  u3m,
  alpha,
  roughness,
  specular,
  isAlphaChanged,
  isRoughnessChanged,
  isSpecularChanged,
  handleAlphaReset,
  handleRoughnessReset,
  handleSpecularReset,
  handleAlphaChange,
  handleRoughnessChange,
  handleSpecularChange,
} = useU3M(props.u3mPath)
const {
  modelIndex,
  currentModel,
  material,
  scale,
  loadModel,
  handleScaleChange,
  handleScaleReset,
} = useModels(
  scene,
  u3m,
  props.dpi,
  props.baseImgUrl,
  props.normalImgUrl,
  props.roughImgUrl,
  props.dispImgUrl,
  loading
)
const {
  pantoneList,
  currentColors,
  colorRemovable,
  colorAddable,
  analyzeImage,
  handleColorChange,
  handleColorInput,
  handleColorAdd,
  handleColorRemove,
} = useColors(props.baseImgUrl, material, 10)

const displayMode = ref(DISPLAY_MODE.MODEL)
const textureType = ref(TEXTURE_TYPE.BASE)
const handleDisplayModeChange = (v: number) => (displayMode.value = v)
const handleTextureClick = (v: number) => (textureType.value = v)

useKeyboard(displayMode, textureType, modelIndex, loadModel, () =>
  emit('close')
)

const textureImages = {
  [TEXTURE_TYPE.BASE]: props.baseImgUrl,
  [TEXTURE_TYPE.NORMAL]: props.normalImgUrl,
  [TEXTURE_TYPE.ROUGHNESS]: props.roughImgUrl,
  [TEXTURE_TYPE.DISPLACEMENT]: props.dispImgUrl,
}

const textureImage = computed(() => textureImages[textureType.value])
</script>

<template lang="pug">
div(class="w-screen h-screen fixed z-popper bg-grey-900/90 left-0 top-0 flex flex-col")
  editor-header(
    :displayMode="displayMode"
    :currentModel="currentModel"
    :textureType="textureType"
    @displayModeChange="handleDisplayModeChange"
    @modelClick="loadModel"
    @textureClick="handleTextureClick"
    @close="emit('close')"
  )
  editor-sidebar(
    v-show="displayMode === DISPLAY_MODE.MODEL"
    :pantoneList="pantoneList"
    :currentColors="currentColors"
    :colorRemovable="colorRemovable"
    :colorAddable="colorAddable"
    :alpha="alpha"
    :roughness="roughness"
    :specular="specular"
    :scale="scale"
    :isAlphaChanged="isAlphaChanged"
    :isRoughnessChanged="isRoughnessChanged"
    :isSpecularChanged="isSpecularChanged"
    :analyzeImage="analyzeImage"
    @colorAdd="handleColorAdd"
    @colorRemove="handleColorRemove"
    @colorChange="handleColorChange"
    @colorInput="handleColorInput"
    @alphaChange="handleAlphaChange"
    @roughnessChange="handleRoughnessChange"
    @specularChange="handleSpecularChange"
    @alphaReset="handleAlphaReset"
    @roughnessReset="handleRoughnessReset"
    @specularReset="handleSpecularReset"
    @scaleReset="handleScaleReset"
    @scaleChange="handleScaleChange"
    @screenshot="takeScreenShot"
  )
  canvas(
    v-show="displayMode === DISPLAY_MODE.MODEL"
    ref="canvas"
    class="w-full h-full"
  )
  div(
    v-show="displayMode === DISPLAY_MODE.TEXTURE"
    class="w-full max-h-full h-full flex items-center justify-center"
  )
    img(class="h-3/4 rounded" :src="textureImage")
  editor-loader(v-if="loading")
</template>
