<template lang="pug">
div(
  class="absolute top-22 left-3 bottom-2 flex flex-col items-stretch w-75 overflow-y-scroll bg-grey-900/90 p-3 rounded-lg text-grey-100"
)
  h5(class="text-h5 font-bold mb-4") {{ $t('EE0137') }}
  slider-input(
    :name="$t('EE0133')"
    :min="0"
    :max="1"
    :step="0.01"
    :range="alpha"
    :changed="isAlphaChanged"
    @update:range="(v) => emit('alphaChange', v)"
    @reset="emit('alphaReset')"
  )
  slider-input(
    :name="$t('EE0134')"
    :min="0"
    :max="1"
    :step="0.01"
    :range="roughness"
    :changed="isRoughnessChanged"
    @update:range="(v) => emit('roughnessChange', v)"
    @reset="emit('roughnessReset')"
  )
  slider-input(
    :name="$t('EE0135')"
    :min="0"
    :max="1"
    :step="0.01"
    :range="specular"
    :changed="isSpecularChanged"
    @update:range="(v) => emit('specularChange', v)"
    @reset="emit('specularReset')"
  )
  slider-input(
    useLog
    :name="$t('EE0136')"
    :min="0.1"
    :max="50"
    :step="0.01"
    :range="scale"
    :resetDisabled="false"
    :changed="scale !== 1"
    @update:range="(v) => emit('scaleChange', v)"
    @reset="emit('scaleReset')"
  )
  div(class="w-full my-6")
    hr(class="w-full text-grey-600")
  h5(class="text-h5 font-bold mb-2") {{ $t('EE0139') }}
  div(class="flex flex-col w-full gap-y-3 mt-3")
    color-input(
      :key="index"
      v-for="(currentColor, index) in currentColors"
      :index="index"
      :color="currentColor"
      :pantoneList="pantoneList"
      @colorChange="(v, index) => emit('colorChange', v, index)"
      @colorInput="(v, index) => emit('colorInput', v, index)"
    )
    div(class="flex flex-row justify-around items-center gap-x-2")
      f-button(
        class="bg-transparent text-grey-300 disabled:text-grey-700 border-none"
        theme="dark"
        type="text"
        size="md"
        :disabled="!colorRemovable"
        @click="emit('colorRemove')"
      ) {{ $t('UU0121') }}
      f-button(
        theme="dark"
        size="md"
        prependIcon="add"
        :disabled="!colorAddable"
        @click="emit('colorAdd')"
      ) {{ $t('UU0120') }}
  div(class="mt-auto")
    div(class="w-full my-6")
      hr(class="w-full text-grey-600")
  div(class="flex flex-row items-center justify-center gap-x-2")
    //- f-button(size="sm" prependIcon="upload"  @click="emit('screenshot')") {{ $t('UU0124') }}
    f-button(
      theme="dark"
      size="sm"
      prependIcon="camera"
      @click="emit('screenshot')"
    ) {{ $t('UU0125') }}
  //- input(ref="fileInput" type="file" @change="handleUploadModel")
</template>

<script setup lang="ts">
import ColorInput from './ColorInput.vue'
import SliderInput from './SliderInput.vue'
import type { PantoneItem } from '../composables/useColors'

defineProps<{
  pantoneList?: { [code: string]: PantoneItem }
  currentColors: string[]
  colorRemovable: boolean
  colorAddable: boolean
  alpha: number
  roughness: number
  specular: number
  scale: number
  isAlphaChanged: boolean
  isRoughnessChanged: boolean
  isSpecularChanged: boolean
  analyzeImage: () => void
}>()

const emit = defineEmits<{
  (e: 'colorAdd'): void
  (e: 'colorRemove'): void
  (e: 'colorChange', v: string, index: number): void
  (e: 'colorInput', v: string, index: number): void
  (e: 'alphaReset'): void
  (e: 'roughnessReset'): void
  (e: 'specularReset'): void
  (e: 'scaleReset'): void
  (e: 'alphaChange', v: number): void
  (e: 'roughnessChange', v: number): void
  (e: 'specularChange', v: number): void
  (e: 'scaleChange', v: number): void
  (e: 'screenshot'): void
}>()
</script>
