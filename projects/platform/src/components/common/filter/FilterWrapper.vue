<template lang="pug">
f-tooltip(v-if="disabled")
  template(#trigger)
    div(class="flex items-center gap-x-1 p-1.5 border rounded-lg border-black-400")
      f-svg-icon(:iconName="iconName" size="24" class="text-black-500")
      span(class="text-black-500 text-body2") {{ displayName }}
      f-svg-icon(iconName="keyboard_arrow_down" size="24" class="text-black-500")
  template(#content)
    p(class="w-72") {{ $t("VV0047") }}
f-popper(
  v-else
  placement="bottom-start"
  @expand="$emit('expand')"
  @collapse="$emit('collapse')"
)
  template(#trigger="{ isExpand }")
    div(class="flex items-center gap-x-1 p-1.5 border rounded-lg cursor-pointer" :class="[isExpand || dirty ? 'border-primary' : 'border-black-400']")
      f-svg-icon(:iconName="iconName" size="24" class="text-primary")
      span(class="text-primary text-body2") {{ displayName }}
      f-svg-icon(iconName="keyboard_arrow_right" size="24" class="text-black-500 transform" :class="[isExpand ? '-rotate-90' : 'rotate-90']")
  template(#content)
    slot
</template>

<script>
export default {
  name: 'FilterWrapper',
  props: {
    iconName: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    },
    dirty: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['expand', 'collapse']
}
</script>
