<template lang="pug">
f-tooltip-standard(v-if="disabled")
  template(#slot:tooltip-trigger)
    div(
      class="flex items-center gap-x-1 p-1.5 border rounded-lg border-grey-250 cursor-default"
    )
      f-svg-icon(:iconName="iconName" size="24" class="text-grey-250")
      span(class="text-grey-250 text-body2") {{ displayName }}
      f-svg-icon(iconName="keyboard_arrow_down" size="24" class="text-grey-250")
  template(#slot:tooltip-content)
    slot
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
      f-svg-icon(:iconName="iconName" size="24" class="text-grey-900")
      span(class="text-grey-900 text-body2") {{ displayName }}
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="24"
        class="text-grey-250 transform"
        :class="[isExpand ? '-rotate-90' : 'rotate-90']"
      )
  template(#content)
    div(class="bg-grey-0 px-5 py-4 rounded shadow-16 flex flex-col gap-y-5")
      slot
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
    iconName: string
    displayName: string
    dirty?: boolean
    disabled?: boolean
    confirmButton?: boolean
    confirmDisabled?: boolean
  }>(),
  {
    dirty: false,
    disabled: false,
    confirmButton: true,
    confirmDisabled: false,
  }
)

defineEmits<{
  (e: 'expand'): void
  (e: 'collapse'): void
  (e: 'confirm'): void
}>()
</script>
