<template>
  <div
    :class="[isMobile ? 'absolute pt-12' : 'relative', 'flex flex-col']"
    :style="{ height: 'calc(100vh - 80px)' }"
  >
    <f-scrollbar-container
      sizeAutoCapable
      class="flex flex-1 min-h-0 bg-primary border-r border-grey-800 transition-width"
      :style="{ width: wrapperWidth }"
    >
      <div
        class="flex flex-col items-stretch pt-6 pb-[26px] text-grey-100 gap-6"
        :class="isMobile ? 'w-77.5 pl-5 pr-3.5' : 'w-85 pl-10 pr-6'"
        ref="contentWrapper"
      >
        <f-infobar
          class="mb-2 items-center"
          :notifyType="NOTIFY_TYPE.WARNING"
          :messageText="$t('EE0214')"
          v-if="isLowDpi"
        />
        <f-tabs
          ref="refTab"
          :tabList="tabList"
          keyField="id"
          :type="TAB_TYPE.CONTROL"
          :initValue="displayMode"
          @switch="switchTab"
          tabItemContainerStyle="flex-1"
          tabListContainerStyle="flex-1 flex-row"
        />
        <editor-model
          v-if="displayMode === DISPLAY_MODE.MODEL"
          :originU3m="originU3m"
          :pantoneList="pantoneList"
          :currentColors="currentColors"
          :colorRemovable="colorRemovable"
          :colorAddable="colorAddable"
          :alpha="alpha"
          :roughness="roughness"
          :specular="specular"
          :scale="scale"
          :models="models"
          :currentModel="currentModel"
          @modelClick="emit('modelClick', $event)"
          @colorAdd="emit('colorAdd')"
          @colorRemove="emit('colorRemove')"
          @colorChange="(v, index) => emit('colorChange', v, index)"
          @colorInput="(v, index) => emit('colorInput', v, index)"
          @alphaChange="emit('alphaChange', $event)"
          @roughnessChange="emit('roughnessChange', $event)"
          @specularChange="emit('specularChange', $event)"
          @scaleChange="emit('scaleChange', $event)"
        />
        <editore-texture
          v-else
          @textureClick="emit('textureClick', $event)"
          :textureImages="textureImages"
          :textureType="textureType"
        />
      </div>
    </f-scrollbar-container>
    <toggle-expand-button :expanded="isShowContent" @click="toggleContent" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import type { TabItem } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import { MIN_DPI_2D_MATERIAL, NOTIFY_TYPE, useBreakpoints } from '@frontier/lib'
import ToggleExpandButton from './ToggleExpandButton.vue'
import type { U3M } from '@/composables/useU3M'
import type { PantoneItem } from '../../composables/useColors'
import { DISPLAY_MODE } from '../../constants'
import type { Model } from '@/constants/models'
import EditorModel from './EditorModel.vue'
import EditoreTexture from './EditoreTexture.vue'
import type { MaterialU3m } from '@frontier/platform-web-sdk'

const { t } = useI18n()
const props = defineProps<{
  originU3m: U3M | undefined
  pantoneList?: { [code: string]: PantoneItem }
  displayMode: DISPLAY_MODE
  currentColors: string[]
  dpi: MaterialU3m['dpi']
  models: Model[]
  currentModel: Model
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

const isShowContent = ref(true)
const wrapperWidth = ref('auto')
const contentWrapper = ref<HTMLElement | null>(null)

const switchTab = (tab: TabItem) => {
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

const toggleContent = () => {
  isShowContent.value = !isShowContent.value
}

watch(isShowContent, (isExpand) => {
  if (contentWrapper.value) {
    const fullWidth = contentWrapper.value.scrollWidth
    wrapperWidth.value = `${fullWidth}px`
    /**
     * if expand, Match the timeout value with CSS transation (0.5s = 500)
     * if colapsed, set timeout to 0, so the CSS animation can run
     */
    const timeout = isExpand ? 500 : 0
    setTimeout(() => {
      wrapperWidth.value = isExpand ? 'auto' : '0px'
    }, timeout)
  }
})

const isLowDpi = (props.dpi ?? 0) < MIN_DPI_2D_MATERIAL

const { isMobile } = useBreakpoints()
</script>

<style scoped>
.transition-width {
  transition: width 0.5s ease-in-out;
  overflow: hidden;
}
</style>
