<template lang="pug">
// If disabled, show a non-interactive, styled div.
// The f-tooltip-standard is removed or would need to be rethought if it's for a text tip.
// For now, focusing on making it non-clickable by not rendering the slot as tooltip content.
div(
  v-if="disabled"
  class="flex items-center gap-x-1 p-1.5 border rounded-lg border-grey-250 cursor-default"
)
  f-svg-icon(v-if="iconName" :iconName="iconName" size="24" class="text-grey-250")
  div(v-else class="w-1")
  span(class="text-grey-250 text-body2") {{ displayName }}
  f-svg-icon(iconName="keyboard_arrow_down" size="24" class="text-grey-250")

// If not disabled, use the f-popper to make the slot content (the menu) appear.
f-popper(
  v-else
  placement="bottom-start"
  @expand="$emit('expand')"
  @collapse="$emit('collapse')"
)
  template(#trigger="{ isExpand }")
    div(
      class="flex items-center gap-x-1 p-1.5 border rounded-lg cursor-pointer"
      :class="[isExpand || dirty ? 'border-grey-900' : 'border-grey-250']"
    )
      f-svg-icon(v-if="iconName" :iconName="iconName" size="24" class="text-grey-900")
      div(v-else class="w-1")
      span(class="text-grey-900 text-body2") {{ displayName }}
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="24"
        class="text-grey-250 transform"
        :class="[isExpand ? '-rotate-90' : 'rotate-90']"
      )
  template(#content)
    div(
      :class="{ 'bg-grey-0 px-5 py-4 rounded shadow-16 flex flex-col gap-y-5': withDefaultContainer }"
    )
      slot // Slot is correctly placed here for the popper content
      f-button(
        v-if="confirmButton"
        size="sm"
        :disabled="confirmDisabled"
        class="self-end"
        @click="$emit('confirm')"
      ) {{ $t('UU0001') }}
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    iconName?: string
    displayName: string
    dirty?: boolean
    disabled?: boolean
    confirmButton?: boolean
    confirmDisabled?: boolean
    withDefaultContainer?: boolean
  }>(),
  {
    dirty: false,
    disabled: false,
    confirmButton: true,
    confirmDisabled: false,
    withDefaultContainer: true,
  }
)

defineEmits<{
  (e: 'expand'): void
  (e: 'collapse'): void
  (e: 'confirm'): void
}>()
</script>
