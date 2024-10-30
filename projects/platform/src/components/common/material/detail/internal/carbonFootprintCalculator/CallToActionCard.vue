<template>
  <div
    class="call-to-action-card w-150 h-full border border-grey-200-v1 rounded-xl py-6 px-5 gap-5 flex flex-col"
    data-theme="startrust"
  >
    <div class="flex flex-col gap-2">
      <p class="text-base font-bold text-grey-900-v1">{{ title }}</p>
      <p class="text-sm text-grey-600-v1">{{ description }}</p>
    </div>
    <div class="flex self-end gap-5">
      <f-button class="explain-button" @click="$emit('explain')">
        {{ explainText }}
      </f-button>
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
  explainText: string
  actionText: string
}>()

const emit = defineEmits(['explain', 'action'])
</script>

<style scoped lang="scss">
$button-padding: 0.5rem 0.75rem; // Equivalent to py-2 px-3
$button-font-size: 1rem; // Equivalent to text-base
$button-border-radius: 0.25rem; // Equivalent to rounded
$explain-button-color: var(--color-text);
$action-button-bg-color: var(--color-background-solid);

.explain-button {
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

.call-to-action-card {
  background-image: url('@/assets/images/card_background.webp');
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat; /* Prevents the image from repeating */
}
</style>
