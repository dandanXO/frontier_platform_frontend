<template lang="pug">
f-tooltip(v-if="disabled")
  template(#trigger)
    div(
      class="flex items-center gap-x-1 p-1.5 border rounded-lg border-grey-250 cursor-default"
    )
      f-svg-icon(:iconName="iconName" size="24" class="text-grey-250")
      span(class="text-grey-250 text-body2") {{ displayName }}
      f-svg-icon(iconName="keyboard_arrow_down" size="24" class="text-grey-250")
  template(#content)
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
    slot
</template>

<script>
export default {
  name: 'FilterWrapper',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    dirty: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['expand', 'collapse'],
}
</script>
