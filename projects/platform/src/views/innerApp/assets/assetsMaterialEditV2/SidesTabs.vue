<template>
  <div class="flex p-1 bg-grey-50-v1 rounded-lg gap-x-2">
    <button
      v-if="
        material.isDoubleSide ||
        material.sideType === MaterialSideType.FACE_SIDE
      "
      @click="selectSide('faceSide')"
      :class="[
        'w-1/3 px-4 py-2 h-12 rounded-md text-base font-bold leading-6 focus:outline-none',
        modelValue === 'faceSide'
          ? 'bg-green-500-v1 text-white'
          : 'bg-grey-50-v1 text-black',
      ]"
    >
      {{ $t('EE0231') }}
    </button>
    <button
      v-if="material.isDoubleSide && material.isComposite"
      @click="selectSide('middleSide')"
      :class="[
        'w-1/3 px-4 py-2 h-12 rounded-md text-base font-bold leading-6 focus:outline-none',
        modelValue === 'middleSide'
          ? 'bg-green-500-v1 text-white'
          : 'bg-grey-50-v1 text-black',
      ]"
    >
      {{ $t('EE0243') }}
    </button>
    <button
      v-if="
        material.isDoubleSide ||
        material.sideType === MaterialSideType.BACK_SIDE
      "
      @click="selectSide('backSide')"
      :class="[
        'w-1/3 px-4 py-2 h-12 rounded-md text-base font-bold leading-6 focus:outline-none',
        modelValue === 'backSide'
          ? 'bg-green-500-v1 text-white'
          : 'bg-grey-50-v1 text-black',
      ]"
    >
      {{ $t('EE0232') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { MaterialSideType } from '@frontier/platform-web-sdk'
import type { Material } from '@frontier/platform-web-sdk'

interface Props {
  material: Material
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectSide = (side: string) => {
  emit('update:modelValue', side)
}
</script>
