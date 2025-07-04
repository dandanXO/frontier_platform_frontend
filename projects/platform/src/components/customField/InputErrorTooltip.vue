<template>
  <f-tooltip
    v-if="desc"
    :desc="desc"
    :placement="TOOLTIP_PLACEMENT?.TOP"
    :offset="[0, 8]"
    interactive
    isDescHTML
    theme="new-dark"
    classContainer="shadow-[0px_4px_8px_0px_rgba(19,20,20,0.05)] shadow-[0px_0px_8px_0px_rgba(19,20,20,0.10)]"
  >
    <template #slot:tooltip-trigger>
      <div
        class="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-50-v1"
      >
        <f-svg-icon iconName="error" size="20" class="text-yellow-500-v1" />
      </div>
    </template>
  </f-tooltip>
</template>

<script lang="ts" setup>
import { TOOLTIP_PLACEMENT } from '@frontier/constants'

defineProps({
  desc: {
    type: String,
    default: '',
  },
})
</script>

<style></style>
