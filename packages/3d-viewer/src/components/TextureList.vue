<template>
  <div class="flex flex-col gap-4" :class="[isDesktop ? undefined : 'w-full']">
    <h5 class="text-lg font-bold" v-if="isDesktop">
      {{ $t('UU0170') }}
    </h5>
    <div v-if="isDesktop" class="flex flex-col gap-3">
      <f-pill
        v-for="type in filteredTextureTypes"
        :key="`texture-types-${type}`"
        @click="$emit('textureClick', type)"
        :size="SIZE.LG"
        :active="textureType === type"
        class="w-full"
      >
        {{ textureLabels[type] }}
      </f-pill>
    </div>
    <f-tabs
      v-else
      :tabList="tabList"
      keyField="id"
      :type="TAB_TYPE.PILLS"
      :initValue="textureType"
      @switch="$emit('textureClick', $event.id)"
      tabItemContainerStyle="flex-1"
      tabListContainerStyle="h-full w-full flex-row gap-2 overflow-scroll"
      class="h-full flex-1"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useBreakpoints } from '@frontier/lib'
import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import { SIZE, TEXTURE_TYPE } from '../constants'

interface Props {
  textureImages: { [x: number]: string | null }
  textureType: number
}
const { isDesktop } = useBreakpoints()

const { t } = useI18n()

const props = defineProps<Props>()

defineEmits<{
  (e: 'textureClick', textureType: number): void
}>()

const filteredTextureTypes = computed(() =>
  Object.keys(props.textureImages).map((key) => Number(key))
)

const textureLabels: { [key: number]: string } = {
  [TEXTURE_TYPE.BASE]: t('UU0172'),
  [TEXTURE_TYPE.ALPHA]: t('UU0173'),
  [TEXTURE_TYPE.METAL]: t('UU0174'),
  [TEXTURE_TYPE.NORMAL]: t('UU0175'),
  [TEXTURE_TYPE.ROUGHNESS]: t('UU0176'),
  [TEXTURE_TYPE.DISPLACEMENT]: t('UU0177'),
}

const tabList = computed(() =>
  filteredTextureTypes.value.map((type) => ({
    id: type,
    name: textureLabels[type],
  }))
)
</script>
