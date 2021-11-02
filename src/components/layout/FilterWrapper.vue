<template lang="pug">
dropdown
  template(#displayItem="{ isExpand }")
    div(class="flex items-center gap-x-1 p-1.5 border rounded-lg" :class="[ isExpand || dirty ? 'border-primary' : 'border-black-400' ]")
      svg-icon(:iconName="iconName" size="24" class="text-primary")
      span(class="text-primary text-body2") {{displayName}}
      svg-icon(iconName="arrow-down" size="24" class="text-black-500 transform" :class="[ isExpand ? '-rotate-90' : 'rotate-90' ]")
  template(#dropdownList)
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
  }
}
</script>
