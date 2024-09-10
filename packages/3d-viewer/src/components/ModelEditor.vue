<script lang="ts" setup>
import { computed, ref } from 'vue'
import 'vue3-carousel/dist/carousel.css'
import useScene from '../composables/useScene'
import useModels from '../composables/useModels'
import useU3M from '../composables/useU3M'
import { useBreakpoints } from '@frontier/lib'
import useKeyboard from '../composables/useKeyboard'
import useScreenshot from '../composables/useScreenshot'
import { DISPLAY_MODE, TEXTURE_TYPE } from '../constants'
import EditorHeader from './EditorHeader.vue'
import EditorSidebar from './sidebar/EditorSidebar.vue'
import HiddenSidebar from './sidebar/HiddenSidebar.vue'
import EditorLoader from './EditorLoader.vue'
import MobileModelControlBar from './MobileModelControlBar.vue'
import MobileTextureControlBar from './MobileTextureControlBar.vue'
import type { Material } from '@frontier/platform-web-sdk'

const props = withDefaults(
  defineProps<{
    u3mPath: string
    dpi: number
    baseImgUrl: string
    material: Material
    normalImgUrl: string
    dispImgUrl: string
    roughImgUrl: string
    bumpImgUrl: string
    alphaImgUrl: string
    onClose?: () => void
  }>(),
  {}
)

const emit = defineEmits<{ (e: 'close'): void }>()

const { scene, camera, container, canvas } = useScene()
const {
  isLoading: isLoadingU3M,
  originU3m,
  u3m,
  alpha,
  roughness,
  specular,
  handleAlphaChange,
  handleRoughnessChange,
  handleSpecularChange,
} = useU3M(props.u3mPath)
const {
  isLoading: isLoadingModel,
  models,
  modelIndex,
  currentModel,
  modelObject,
  scale,
  pantoneList,
  currentColors,
  colorRemovable,
  colorAddable,
  loadModel,
  moireEffectPreventToggle,
  handleScaleChange,
  handleColorChange,
  handleColorInput,
  handleColorAdd,
  handleColorRemove,
} = useModels(
  scene,
  u3m,
  props.dpi,
  props.baseImgUrl,
  props.normalImgUrl,
  props.roughImgUrl,
  props.dispImgUrl,
  props.bumpImgUrl || '',
  props.alphaImgUrl || ''
)

const { takeScreenshot } = useScreenshot(camera, canvas, modelObject)

const displayMode = ref(DISPLAY_MODE.MODEL)
const textureType = ref(TEXTURE_TYPE.BASE)
const handleDisplayModeChange = (v: number) => (displayMode.value = v)
const handleTextureClick = (v: number) => (textureType.value = v)
const handleClose = () => {
  emit('close')
  props.onClose?.()
}

useKeyboard(
  displayMode,
  textureType,
  models,
  modelIndex,
  loadModel,
  handleClose
)

const textureImages = {
  [TEXTURE_TYPE.BASE]: props.baseImgUrl,
  [TEXTURE_TYPE.NORMAL]: props.normalImgUrl,
  [TEXTURE_TYPE.ROUGHNESS]: props.roughImgUrl,
  [TEXTURE_TYPE.DISPLACEMENT]: props.dispImgUrl,
  [TEXTURE_TYPE.METAL]: props.bumpImgUrl,
  [TEXTURE_TYPE.ALPHA]: props.alphaImgUrl,
}

const textureImage = computed(() => textureImages[textureType.value])

const { isMobile } = useBreakpoints()
const sidebarExpanded = ref(!isMobile.value)
const handleSidebarToggle = () => {
  sidebarExpanded.value = !sidebarExpanded.value
}
</script>

<template lang="pug">
div(class="w-screen h-screen fixed z-popper bg-grey-900/90 left-0 top-0 flex flex-col")
  editor-header(
    :textureImages="textureImages"
    :displayMode="displayMode"
    :currentModel="currentModel"
    :textureType="textureType"
    :models="models"
    @displayModeChange="handleDisplayModeChange"
    @modelClick="loadModel"
    @textureClick="handleTextureClick"
    @close="handleClose"
  )
  div(
    v-show="displayMode === DISPLAY_MODE.MODEL"
    class="relative flex flex-col flex-1 min-h-0"
  )
    div(class="relative flex flex-row flex-1 min-h-0 items-stretch")
      template(v-if="!isLoadingU3M && !isLoadingModel")
        editor-sidebar(
          v-show="sidebarExpanded"
          :originU3m="originU3m"
          :pantoneList="pantoneList"
          :currentColors="currentColors"
          :colorRemovable="colorRemovable"
          :colorAddable="colorAddable"
          :alpha="alpha"
          :roughness="roughness"
          :specular="specular"
          :scale="scale"
          :material="material"
          @toggleExpand="handleSidebarToggle"
          @colorAdd="handleColorAdd"
          @colorRemove="handleColorRemove"
          @colorChange="handleColorChange"
          @colorInput="handleColorInput"
          @alphaChange="handleAlphaChange"
          @roughnessChange="handleRoughnessChange"
          @specularChange="handleSpecularChange"
          @scaleChange="handleScaleChange"
          @screenshot="takeScreenshot"
          @toggleMoireEffectPrevent="moireEffectPreventToggle"
        )
      hidden-sidebar(
        v-show="!sidebarExpanded && !isMobile"
        @toggle-expand="handleSidebarToggle"
      )
      div(ref="container" class="flex-1")
        canvas(ref="canvas")
    mobile-model-control-bar(
      v-if="isMobile"
      :expanded="sidebarExpanded"
      @toggleExpand="handleSidebarToggle"
      @close="handleClose"
    )
  div(
    v-show="displayMode === DISPLAY_MODE.TEXTURE"
    class="relative flex-1 w-full flex items-center min-h-0 justify-center"
  )
    img(
      class="rounded"
      :style="{ maxHeight: '75%', maxWidth: '75%' }"
      :src="textureImage"
    )
    mobile-texture-control-bar(
      v-if="!!isMobile"
      :expanded="sidebarExpanded"
      @toggleExpand="handleSidebarToggle"
      @close="handleClose"
    )
  editor-loader(v-if="isLoadingModel")
</template>
