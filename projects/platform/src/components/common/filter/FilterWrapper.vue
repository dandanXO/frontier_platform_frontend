<template lang="pug">
f-popper(
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
    }
  },
  emits: ['expand', 'collapse']
}
</script>
