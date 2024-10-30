<template>
  <div
    class="w-150 h-full border border-grey-200-v1 rounded-xl py-6 px-5 gap-6 flex flex-col"
    data-theme="startrust"
  >
    <div class="flex h-22 justify-center">
      <f-svg-icon iconName="quota_exceeded" size="88" />
    </div>
    <div class="flex flex-col gap-2 text-center">
      <p class="text-xl font-bold text-red-50-v1">{{ title }}</p>
      <p class="text-sm text-grey-900-v1">{{ description }}</p>
    </div>
    <div class="flex justify-center items-center gap-5">
      <f-button class="action-button" @click="$emit('action')">
        {{ actionText }}
      </f-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  actionText: string
}>()

const emit = defineEmits(['action'])
</script>

<style scoped lang="scss">
$button-width: 12.5rem; // Equivalent to w-50
$button-padding: 0.5rem 0.75rem; // Equivalent to py-2 px-3
$button-font-size: 0.875rem; // Equivalent to text-sm
$button-font-weight: bold; // Equivalent to font-bold
$button-color: white;
$button-bg-color: var(--color-background-solid);
$button-border-radius: 0.25rem; // Equivalent to rounded
$button-border: 1px solid transparent; // Assuming border is needed

.action-button {
  width: $button-width;
  padding: $button-padding;
  font-size: $button-font-size;
  font-weight: $button-font-weight;
  color: $button-color;
  background-color: $button-bg-color;
  border: $button-border;
  border-radius: $button-border-radius;

  &:hover {
    color: $button-color;
    background-color: $button-bg-color;
  }
}
</style>
