<template lang="pug">
div(
  class="w-150 h-full border border-[#C9C9C9] rounded-xl py-6 px-5 gap-8 flex flex-col"
  data-theme="startrust"
)
  div(class="flex flex-col gap-1")
    p(class="text-2xl font-bold text-malibu-700") {{ title }}
    p(class="text-xs text-[#717272]") {{ description }}
  div(v-if="data" class="flex flex-col gap-2")
    p(class="text-end text-xs text-[#717272]") {{ $t('RR0464') }}
    DataRow(:label="$t('RR0454')" :value="data.rawMaterial")
    DataRow(:label="$t('RR0448')" :value="data.process")
    DataRow(:label="$t('RR0449')" :value="data.distribution")
    //- DataRow(:label="$t('RR0450')" :value="data.usage")
    //- DataRow(:label="$t('RR0451')" :value="data.disposal")
    div(class="py-1")
      hr(class="border-[#C9C9C9]") 
    DataRow(:label="$t('OO0034')" :value="data.total")
  div(class="flex self-end gap-2")
    f-button(class="explain-button" @click="$emit('explain')") {{ explainText }}
    f-button(class="action-button" @click="$emit('action')") {{ actionText }}
</template>

<script setup lang="ts">
import DataRow from './DataRow.vue' // Import the new component

const props = defineProps<{
  title: string
  description: string
  explainText: string
  actionText: string
  data?: {
    rawMaterial: any
    process: any
    distribution: any
    usage: any
    disposal: any
    total: any
  }
}>()

const emit = defineEmits(['explain', 'action'])
</script>

<style scoped lang="scss">
$button-padding: 0.5rem 0.75rem; // Equivalent to py-2 px-3
$button-font-size: 1rem; // Equivalent to text-base
$button-border-radius: 0.25rem; // Equivalent to rounded
$explain-button-color: var(--color-text);
$action-button-bg-color: var(--color-background-solid);
$border-color: #dedede;

.explain-button {
  border: 1px solid $border-color;
  padding: $button-padding;
  font-size: $button-font-size;
  color: $explain-button-color;
  border-radius: $button-border-radius;
  background-color: transparent;

  &:hover {
    background-color: transparent;
    color: $explain-button-color;
  }
}

.action-button {
  padding: $button-padding;
  font-size: $button-font-size;
  font-weight: bold; // Equivalent to font-bold
  color: white;
  background-color: $action-button-bg-color;
  border: 1px solid transparent; // Assuming border is needed
  border-radius: $button-border-radius;

  &:hover {
    color: white;
    background-color: $action-button-bg-color;
  }
}
</style>
