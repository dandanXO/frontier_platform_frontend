<template lang="pug">
div(class="shrink-0 w-full h-20 bg-grey-900 px-10 flex items-center justify-between")
  div(class="flex items-center text-grey-100")
    f-svg-icon(iconName="3D_viewer" size="24")
    p(class="text-h5 font-bold pl-4") {{ $t('EE0029') }}
  div(class="flex flex-row")
    model-texture-switch(
      :displayMode="displayMode"
      @update:displayMode="(v) => emit('displayModeChange', v)"
    )
    div(class="w-150 px-10")
      div(v-if="displayMode === DISPLAY_MODE.MODEL")
        carousel(:settings="settings")
          slide(v-for="(model, index) in MODELS" :key="model.name")
            div(
              class="cursor-pointer mx-1 hover:opacity-70 border border-grey-700 rounded"
              :class="{ '!border-primary-400': currentModel.name === model.name }"
              @click="emit('modelClick', index)"
            )
              img(:src="model.coverImg" class="rounded")
      div(v-else class="flex flex-row gap-x-2")
        dark-tag(
          @click="emit('textureClick', TEXTURE_TYPE.BASE)"
          :active="textureType === TEXTURE_TYPE.BASE"
        ) base
        dark-tag(
          @click="emit('textureClick', TEXTURE_TYPE.NORMAL)"
          :active="textureType === TEXTURE_TYPE.NORMAL"
        ) normal
        dark-tag(
          @click="emit('textureClick', TEXTURE_TYPE.ROUGHNESS)"
          :active="textureType === TEXTURE_TYPE.ROUGHNESS"
        ) roughness
        dark-tag(
          @click="emit('textureClick', TEXTURE_TYPE.DISPLACEMENT)"
          :active="textureType === TEXTURE_TYPE.DISPLACEMENT"
        ) displacement
  f-button(theme="dark" size="md" @click="emit('close')") {{ $t('UU0112') }}
</template>

<script setup lang="ts">
import { Carousel, Slide } from 'vue3-carousel'
import DarkTag from '@frontier/ui-component/src/FTag/DarkTag.vue'
import ModelTextureSwitch from './ModelTextureSwitch.vue'
import MODELS from '../constants/models'
import type { Model } from '../constants/models'
import { DISPLAY_MODE, TEXTURE_TYPE } from '../constants'

defineProps<{
  displayMode: number
  currentModel: Model
  textureType: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'displayModeChange', displayMode: number): void
  (e: 'modelClick', modelIndex: number): void
  (e: 'textureClick', textureType: number): void
}>()
const settings = { itemsToShow: 10, snapAlign: 'center' }
</script>

<style lang="scss">
.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  background-color: #444;
  width: 25px;
  height: 25px;
}

.carousel__prev {
  transform: translate(-30px, -20px);
}

.carousel__next {
  transform: translate(30px, -20px);
}

.carousel__pagination-button {
  background-color: #444;
  opacity: 0.6;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 15px 8px 0;
}

.carousel__pagination-button--active {
  background-color: #444;
  opacity: 1;
}
</style>
