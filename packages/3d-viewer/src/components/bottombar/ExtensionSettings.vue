<template>
  <div class="flex flex-col gap-4 w-full">
    <f-tabs
      ref="refTab"
      :tabList="tabList"
      keyField="id"
      :type="TAB_TYPE.PILLS"
      :initValue="tabId"
      @switch="tabId = $event.id"
      tabItemContainerStyle="flex-1"
      tabListContainerStyle="h-full flex-row gap-2"
      class="h-full flex-1"
    />
    <div class="flex flex-col gap-1 text-primary-inverse">
      <div class="self-center">{{ sliderValue }}</div>

      <f-input-slider
        v-if="tabId === TAB_ID.SCALE"
        :range="scale"
        @update:range="emit('scaleChange', $event)"
        :min="0.1"
        :max="50"
        :step="0.01"
        :tooltips="false"
        :defaultRange="1"
        inputWidth="w-18"
        :theme="THEME.DARK"
        useLog
        :canReset="false"
      />
      <f-input-slider
        v-else
        :range="sliderValue"
        @update:range="emit(emitMap[tabId], $event)"
        :min="0.1"
        :max="1"
        :step="0.01"
        :tooltips="false"
        :defaultRange="1"
        inputWidth="w-18"
        :theme="THEME.DARK"
        useLog
        :canReset="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import { THEME } from '@frontier/constants'

enum TAB_ID {
  MODEL = 0,
  ROUGHNESS = 1,
  SPECULAR = 2,
  SCALE = 3,
}
const { t } = useI18n()

const props = defineProps<{
  alpha: number
  roughness: number
  specular: number
  scale: number
}>()

type MicroSliderEvent = 'alphaChange' | 'roughnessChange' | 'specularChange'

const emit = defineEmits<{
  (e: 'scaleChange', v: number): void
  (e: MicroSliderEvent, v: number): void
}>()

const tabId = ref<TAB_ID>(TAB_ID.MODEL)

const sliderValue = computed(() => {
  const { alpha, roughness, specular, scale } = props

  const values = {
    [TAB_ID.MODEL]: alpha,
    [TAB_ID.ROUGHNESS]: roughness,
    [TAB_ID.SPECULAR]: specular,
    [TAB_ID.SCALE]: scale,
  }

  return values[tabId.value] || 0
})

const emitMap: Record<Exclude<TAB_ID, TAB_ID.SCALE>, MicroSliderEvent> = {
  [TAB_ID.MODEL]: 'alphaChange',
  [TAB_ID.ROUGHNESS]: 'roughnessChange',
  [TAB_ID.SPECULAR]: 'specularChange',
}

const tabList = computed(() => [
  {
    id: TAB_ID.MODEL,
    name: t('EE0133'),
  },
  {
    id: TAB_ID.ROUGHNESS,
    name: t('EE0134'),
  },
  {
    id: TAB_ID.SPECULAR,
    name: t('EE0135'),
  },
  {
    id: TAB_ID.SCALE,
    name: t('EE0136'),
  },
])
</script>
