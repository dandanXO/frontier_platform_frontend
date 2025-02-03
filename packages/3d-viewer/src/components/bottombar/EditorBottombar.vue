<template>
  <div
    class="flex flex-col flex-initial min-h-13 items-center justify-center w-full"
  >
    <extension-bottombar v-if="activeSection !== undefined">
      <template #content>
        <extension-model
          :models="models"
          :current-model="currentModel"
          @modelClick="emit('modelClick', $event)"
          :displayMode="displayMode"
          :textureImages="textureImages"
          :textureType="textureType"
          @textureClick="emit('textureClick', $event)"
          v-if="activeSection === BOTTOMBAR_SECTION.MODEL"
        />
        <extension-settings
          v-if="activeSection === BOTTOMBAR_SECTION.SETTINGS"
          @displayModeChange="$emit('displayModeChange', $event)"
          @alphaChange="$emit('alphaChange', $event)"
          @roughnessChange="$emit('roughnessChange', $event)"
          @specularChange="$emit('specularChange', $event)"
          @scaleChange="$emit('scaleChange', $event)"
          :alpha="alpha"
          :roughness="roughness"
          :specular="specular"
          :scale="scale"
        />
        <extension-color
          v-if="activeSection === BOTTOMBAR_SECTION.COLOR"
          :colorAddable="colorAddable"
          :currentColors="currentColors"
          :colorRemovable="colorRemovable"
          @colorAdd="$emit('colorAdd')"
          @colorRemove="$emit('colorRemove')"
          @colorInput="(v, index) => $emit('colorInput', v, index)"
        />
      </template>
    </extension-bottombar>
    <div
      class="flex flex-row items-center justify-center w-full h-full gap-3 p-4 flex-1"
    >
      <f-tabs
        ref="refTab"
        :tabList="tabList"
        keyField="id"
        :type="TAB_TYPE.CONTROL"
        :initValue="displayMode"
        @switch="switchTab"
        tabItemContainerStyle="flex-1"
        tabListContainerStyle="h-full flex-row"
        class="h-full flex-1"
      />
      <div class="flex flex-initial border border-primary-border h-full" />
      <div class="flex flex-auto items-center justify-center gap-3">
        <section-bottombar
          :title="$t('UU0171')"
          iconName="layers"
          size="18"
          @click="activateSection(BOTTOMBAR_SECTION.MODEL)"
          :active="activeSection === BOTTOMBAR_SECTION.MODEL"
        />
        <section-bottombar
          :title="$t('RR0122')"
          iconName="instant_mix"
          size="18"
          :active="activeSection === BOTTOMBAR_SECTION.SETTINGS"
          @click="activateSection(BOTTOMBAR_SECTION.SETTINGS)"
          v-if="displayMode === DISPLAY_MODE.MODEL"
        />
        <section-bottombar
          :title="$t('RR0026')"
          iconName="palette"
          size="18"
          :active="activeSection === BOTTOMBAR_SECTION.COLOR"
          @click="activateSection(BOTTOMBAR_SECTION.COLOR)"
          v-if="displayMode === DISPLAY_MODE.MODEL"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import type { TabItem } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import type { U3M } from '@/composables/useU3M'
import type { PantoneItem } from '../../composables/useColors'
import { BOTTOMBAR_SECTION, DISPLAY_MODE } from '../../constants'
import type {
  MaterialU3m,
  Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner,
} from '@frontier/platform-web-sdk'
import SectionBottombar from './SectionBottombar.vue'
import ExtensionBottombar from './ExtensionBottombar.vue'
import ExtensionModel from './ExtensionModel.vue'
import ExtensionSettings from './ExtensionSettings.vue'
import ExtensionColor from './ExtensionColor.vue'

const { t } = useI18n()
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

const emit = defineEmits<{
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

const activeSection = ref<BOTTOMBAR_SECTION>()

const activateSection = (value: BOTTOMBAR_SECTION) => {
  activeSection.value = value === activeSection.value ? undefined : value
}

const switchTab = (tab: TabItem) => {
  activeSection.value = undefined
  emit('displayModeChange', tab.id)
}
const tabList = computed(() => [
  {
    id: DISPLAY_MODE.MODEL,
    name: t('UU0122'),
  },
  {
    id: DISPLAY_MODE.TEXTURE,
    name: t('UU0123'),
  },
])
</script>
