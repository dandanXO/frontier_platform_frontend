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
import EditorLoader from './EditorLoader.vue'
import type { Material, MaterialU3m } from '@frontier/platform-web-sdk'
import { useRoute } from 'vue-router'

const props = withDefaults(
  defineProps<{
    u3mPath: MaterialU3m['u3mSpecUrl']
    dpi: MaterialU3m['dpi']
    baseImgUrl: MaterialU3m['baseImgUrl']
    material: Material
    normalImgUrl: MaterialU3m['normalImgUrl']
    dispImgUrl: MaterialU3m['dispImgUrl']
    roughImgUrl: MaterialU3m['roughImgUrl']
    metalImgUrl: MaterialU3m['metalImgUrl']
    alphaImgUrl: MaterialU3m['alphaImgUrl']
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
  props.dpi ?? 0,
  props.baseImgUrl || '',
  props.normalImgUrl || '',
  props.roughImgUrl || '',
  props.dispImgUrl || '',
  props.metalImgUrl || '',
  props.alphaImgUrl || ''
)

const route = useRoute()
const open3d = route.query.open3d
const allowClose = open3d !== 'true'

const { takeScreenshot } = useScreenshot(camera, canvas, modelObject)

const displayMode = ref(DISPLAY_MODE.MODEL)
const textureType = ref(TEXTURE_TYPE.BASE)
const handleDisplayModeChange = (v: number) => (displayMode.value = v)
const handleTextureClick = (v: number) => (textureType.value = v)
const handleClose = () => {
  if (allowClose) {
    emit('close')
    props.onClose?.()
  }
}

useKeyboard(
  displayMode,
  textureType,
  models,
  modelIndex,
  loadModel,
  handleClose
)

const textureImages = computed(() => {
  const baseImages = {
    [TEXTURE_TYPE.BASE]: props.baseImgUrl,
    [TEXTURE_TYPE.NORMAL]: props.normalImgUrl,
    [TEXTURE_TYPE.ROUGHNESS]: props.roughImgUrl,
    [TEXTURE_TYPE.DISPLACEMENT]: props.dispImgUrl,
  }

  if (props.metalImgUrl) {
    baseImages[TEXTURE_TYPE.METAL] = props.metalImgUrl
  }
  if (props.alphaImgUrl) {
    baseImages[TEXTURE_TYPE.ALPHA] = props.alphaImgUrl
  }

  return baseImages
})

const textureImage = computed(() => textureImages.value[textureType.value])

const { isMobile } = useBreakpoints()
const sidebarExpanded = ref(!isMobile.value)
const handleSidebarToggle = () => {
  sidebarExpanded.value = !sidebarExpanded.value
}
</script>

<template lang="pug">
div(
  class="w-screen h-screen fixed z-popper bg-primary left-0 top-0 flex flex-col"
  data-theme="new-dark"
)
  editor-header(
    @close="handleClose"
    @screenshot="takeScreenshot"
    :showCloseButton="allowClose"
    :displayMode="displayMode"
  )
  div(class="relative flex flex-col flex-1 min-h-0")
    div(class="relative flex flex-row flex-1 min-h-0 items-stretch")
      template(v-if="!isLoadingU3M && !isLoadingModel")
        editor-sidebar(
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
          @modelClick="loadModel"
          @displayModeChange="handleDisplayModeChange"
          @toggleExpand="handleSidebarToggle"
          @textureClick="handleTextureClick"
          @colorAdd="handleColorAdd"
          @colorRemove="handleColorRemove"
          @colorChange="handleColorChange"
          @colorInput="handleColorInput"
          @alphaChange="handleAlphaChange"
          @roughnessChange="handleRoughnessChange"
          @specularChange="handleSpecularChange"
          @scaleChange="handleScaleChange"
          @toggleMoireEffectPrevent="moireEffectPreventToggle"
        )
      div(ref="container" class="flex-1" v-show="displayMode === DISPLAY_MODE.MODEL")
        canvas(ref="canvas")
      div(
        v-show="displayMode === DISPLAY_MODE.TEXTURE"
        class="flex-1 flex items-center justify-center bg-tertiary bg-opacity-60"
      )
        img(
          v-if="textureImage"
          class="rounded"
          :style="{ maxHeight: '75%', maxWidth: '75%' }"
          :src="textureImage"
        )
  editor-loader(v-if="isLoadingModel")
</template>
