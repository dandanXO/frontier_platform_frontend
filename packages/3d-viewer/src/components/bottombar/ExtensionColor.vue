<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="grid grid-cols-2 gap-2">
      <color-item
        v-for="(currentColor, index) in currentColors"
        :key="index"
        :index="index"
        :color="currentColor"
        @colorInput="(v, index) => $emit('colorInput', v, index)"
      />
    </div>
    <div class="grid grid-cols-2 gap-2 w-full">
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
        :size="SIZE.MD"
        prependIcon="add"
        type="secondary"
        :disabled="!colorAddable"
        @click="$emit('colorAdd')"
      >
        {{ $t('UU0120') }}
      </f-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SIZE, THEME } from '@frontier/constants'
import ColorItem from './ColorItem.vue'

defineProps<{
  colorAddable: boolean
  colorRemovable: boolean
  currentColors: string[]
}>()

defineEmits<{
  (e: 'colorAdd'): void
  (e: 'colorRemove'): void
  (e: 'colorInput', color: string, index: number): void
}>()
</script>
