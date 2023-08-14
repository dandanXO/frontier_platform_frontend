<template lang="pug">
div(
  class="flex flex-col"
  :class="largerThenMd ? 'relative' : 'absolute pt-12'"
  :style="{ height: 'calc(100vh - 80px)' }"
)
  f-scrollbar-container(sizeAutoCapable class="flex flex-1 min-h-0 bg-grey-900")
    div(
      class="flex flex-col items-stretch border-r border-grey-800 pt-6 pb-[26px] text-grey-100"
      :class="largerThenMd ? 'w-[340px] pl-10 pr-6' : 'w-[310px] pl-5 pr-[14px]'"
    )
      h5(v-if="largerThenMd" class="text-body1 font-bold mb-4") {{ $t('EE0137') }}
      f-input-slider(
        :range="alpha"
        @update:range="(v: number) => emit('alphaChange', v)"
        withInput
        :label="$t('EE0133')"
        :min="0"
        :max="1"
        :step="0.01"
        :tooltips="false"
        :defaultRange="originU3m?.alpha"
        inputWidth="w-18"
        :theme="THEME.DARK"
      )
      f-input-slider(
        :range="roughness"
        @update:range="(v: number) => emit('roughnessChange', v)"
        withInput
        :label="$t('EE0134')"
        :min="0"
        :max="1"
        :step="0.01"
        :tooltips="false"
        :defaultRange="originU3m?.roughness"
        inputWidth="w-18"
        :theme="THEME.DARK"
      )
      f-input-slider(
        :range="specular"
        @update:range="(v: number) => emit('specularChange', v)"
        withInput
        :label="$t('EE0135')"
        :min="0"
        :max="1"
        :step="0.01"
        :tooltips="false"
        :defaultRange="originU3m?.specular"
        inputWidth="w-18"
        :theme="THEME.DARK"
      )
      f-input-slider(
        :range="scale"
        @update:range="(v: number) => emit('scaleChange', v)"
        withInput
        :label="$t('EE0136')"
        :min="0.1"
        :max="50"
        :step="0.01"
        :tooltips="false"
        :defaultRange="1"
        inputWidth="w-18"
        :theme="THEME.DARK"
        useLog
      )
      div(class="w-full my-6")
        hr(class="w-full text-grey-600")
      h5(class="text-body1 font-bold mb-2") {{ $t('EE0139') }}
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
            :theme="THEME.DARK"
            type="text"
            :size="SIZE.MD"
            :disabled="!colorRemovable"
            @click="emit('colorRemove')"
          ) {{ $t('UU0121') }}
          f-button(
            :theme="THEME.DARK"
            :size="SIZE.MD"
            prependIcon="add"
            type="secondary"
            :disabled="!colorAddable"
            @click="emit('colorAdd')"
          ) {{ $t('UU0120') }}
      div(class="mt-auto")
        div(class="w-full my-6")
          hr(class="w-full text-grey-600")
      div(class="flex flex-row items-center justify-center gap-x-2")
        //- f-button(size="sm" prependIcon="upload"  @click="emit('screenshot')") {{ $t('UU0124') }}
        f-button(
          :theme="THEME.DARK"
          :size="SIZE.SM"
          prependIcon="camera"
          type="secondary"
          @click="emit('screenshot')"
        ) {{ $t('UU0125') }}
        //- This moire effect prevent on/off button is only for testing purpose, DON'T use in prod env.
        //- f-button(
        //-   :theme="THEME.DARK"
        //-   size="sm"
        //-   prependIcon="camera"
        //-   @click="emit('toggleMoireEffectPrevent')"
        //- ) MoireEffect
      //- input(ref="fileInput" type="file" @change="handleUploadModel")
  toggle-expand-button(
    class="z-1"
    v-if="largerThenMd"
    expanded
    @click="emit('toggleExpand')"
  )
</template>

<script setup lang="ts">
import ColorInput from '../ColorInput.vue'
import ToggleExpandButton from './ToggleExpandButton.vue'
import useBreakpoints from '../../composables/useBreakpoints'
import type { PantoneItem } from '../../composables/useColors'
import { THEME, SIZE } from '../../constants'
import type { U3M } from '@/composables/useU3M'

defineProps<{
  originU3m: U3M | undefined
  pantoneList?: { [code: string]: PantoneItem }
  currentColors: string[]
  colorRemovable: boolean
  colorAddable: boolean
  alpha: number
  roughness: number
  specular: number
  scale: number
}>()

const emit = defineEmits<{
  (e: 'colorAdd'): void
  (e: 'colorRemove'): void
  (e: 'colorChange', v: string, index: number): void
  (e: 'colorInput', v: string, index: number): void
  (e: 'alphaChange', v: number): void
  (e: 'roughnessChange', v: number): void
  (e: 'specularChange', v: number): void
  (e: 'scaleChange', v: number): void
  (e: 'screenshot'): void
  (e: 'toggleExpand'): void
  (e: 'toggleMoireEffectPrevent'): void
}>()

const { largerThenMd } = useBreakpoints()
</script>
