<template lang="pug">
tooltip(
  placement='bottom-start'
  :manual='true'
  :showArrow='false'
  :offset='[0, 8]'
  @show="$emit('show')"
  @hide="$emit('hide')"
)
  template(#trigger="{ isActive }")
    div(class="flex items-center gap-x-1 p-1.5 border rounded-lg cursor-pointer" :class="[ isActive || dirty ? 'border-primary' : 'border-black-400' ]")
      svg-icon(:iconName="iconName" size="24" class="text-primary")
      span(class="text-primary text-body2") {{displayName}}
      svg-icon(iconName="arrow-down" size="24" class="text-black-500 transform" :class="[ isActive ? '-rotate-90' : 'rotate-90' ]")
  template(#content)
    slot
</template>

<script>
export default {
  name: 'FilterDropdown',
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
  emits: ['show', 'hide']
}
</script>
