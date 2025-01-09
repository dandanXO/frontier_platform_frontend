<template>
  <div class="flex flex-col gap-4">
    <h5 class="text-lg font-bold">{{ $t('UU0170') }}</h5>
    <div class="flex flex-col gap-3">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { SIZE, TEXTURE_TYPE } from '../../constants'

interface Props {
  textureImages: { [x: number]: string | null }
  textureType: number
}

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
</script>
