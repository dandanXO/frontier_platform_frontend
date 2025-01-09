<template>
  <section-sidebar :title="$t('UU0171')">
    <template #content>
      <div class="flex flex-row flex-wrap gap-2 justify-start">
        <div
          v-for="(model, index) in models"
          :key="model.name"
          class="h-[60px] w-[60px] hover:opacity-70 border border-grey-700 rounded shrink-0 cursor-pointer"
          :class="{ '!border-brand-solid': currentModel.name === model.name }"
          @click="$emit('modelClick', index)"
        >
          <img
            :src="model.coverImg"
            class="rounded h-full w-full object-cover"
          />
        </div>
      </div>
    </template>
  </section-sidebar>
  <div class="border border-secondary-border" />
  <section-sidebar :title="$t('RR0122')">
    <template #content>
      <f-input-slider
        :range="alpha"
        @update:range="$emit('alphaChange', $event)"
        withInput
        :label="$t('EE0133')"
        :min="0"
        :max="1"
        :step="0.01"
        :tooltips="false"
        :defaultRange="originU3m?.alpha"
        inputWidth="w-18"
        :theme="THEME.DARK"
      />
      <f-input-slider
        :range="roughness"
        @update:range="$emit('roughnessChange', $event)"
        withInput
        :label="$t('EE0134')"
        :min="0"
        :max="1"
        :step="0.01"
        :tooltips="false"
        :defaultRange="originU3m?.roughness"
        inputWidth="w-18"
        :theme="THEME.DARK"
      />
      <f-input-slider
        :range="specular"
        @update:range="$emit('specularChange', $event)"
        withInput
        :label="$t('EE0135')"
        :min="0"
        :max="1"
        :step="0.01"
        :tooltips="false"
        :defaultRange="originU3m?.specular"
        inputWidth="w-18"
        :theme="THEME.DARK"
      />
      <f-input-slider
        :range="scale"
        @update:range="$emit('scaleChange', $event)"
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
      />
    </template>
  </section-sidebar>
  <div class="border border-secondary-border"></div>
  <template v-if="store.getters['permission/enable3DViewerColor']">
    <section-sidebar :title="$t('RR0026')">
      <template #content>
        <color-input
          v-for="(currentColor, index) in currentColors"
          :key="index"
          :index="index"
          :color="currentColor"
          :pantoneList="pantoneList"
          @colorChange="(v, index) => $emit('colorChange', v, index)"
          @colorInput="(v, index) => $emit('colorInput', v, index)"
        />
        <div class="flex flex-row justify-around items-center gap-x-2">
          <f-button
            class="bg-transparent text-grey-300 disabled:text-grey-700 border-none"
            :theme="THEME.DARK"
            type="text"
            :size="SIZE.MD"
            :disabled="!colorRemovable"
            @click="$emit('colorRemove')"
          >
            {{ $t('UU0121') }}
          </f-button>
          <f-button
            :theme="THEME.DARK"
            :size="SIZE.MD"
            prependIcon="add"
            type="secondary"
            :disabled="!colorAddable"
            @click="$emit('colorAdd')"
          >
            {{ $t('UU0120') }}
          </f-button>
        </div>
      </template>
    </section-sidebar>
    <div class="border border-secondary-border" />
  </template>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'

import type { PantoneItem } from '@/composables/useColors'
import type { U3M } from '@/composables/useU3M'
import type { Model } from '@/constants/models'
import { THEME, SIZE } from '../../constants'
import ColorInput from '../ColorInput.vue'
import SectionSidebar from './SectionSidebar.vue'

defineProps<{
  originU3m: U3M | undefined
  pantoneList?: { [code: string]: PantoneItem }
  currentColors: string[]
  models: Model[]
  currentModel: Model
  colorRemovable: boolean
  colorAddable: boolean
  alpha: number
  roughness: number
  specular: number
  scale: number
}>()

defineEmits<{
  (e: 'modelClick', modelIndex: number): void
  (e: 'colorAdd'): void
  (e: 'colorRemove'): void
  (e: 'colorChange', v: string, index: number): void
  (e: 'colorInput', v: string, index: number): void
  (e: 'alphaChange', v: number): void
  (e: 'roughnessChange', v: number): void
  (e: 'specularChange', v: number): void
  (e: 'scaleChange', v: number): void
}>()
const store = useStore()
</script>
