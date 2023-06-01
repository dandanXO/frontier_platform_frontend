<template lang="pug">
f-popper(
  placement="bottom-start"
  @expand="$emit('expand')"
  @collapse="$emit('collapse')"
)
  template(#trigger="{ isExpand }")
    div(
      class="w-40 h-9 flex items-center justify-between px-3 border rounded hover:bg-grey-50 cursor-pointer"
      :class="[isExpand || dirty ? 'border-primary-300' : 'border-grey-200']"
      :style="{ 'box-shadow': isExpand || dirty ? '0px 0px 0px 3px rgba(233, 248, 243, 0.85)' : 'none' }"
    )
      div(class="flex items-center gap-x-2")
        f-svg-icon(:iconName="iconName" size="24" class="text-body2 text-grey-900")
        span(class="text-grey-900 text-body2") {{ filterCount > 0 ? `${displayName} (${filterCount})` : displayName }}
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="20"
        class="transform"
        :class="[isExpand ? '-rotate-90' : 'rotate-90', isExpand || dirty ? 'text-primary-500' : 'text-grey-600']"
      )
  template(#content="{ collapsePopper }")
    div(class="bg-grey-0 shadow-4 rounded")
      slot(:collapsePopper="collapsePopper")
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
    filterCount: {
      type: Number,
      required: true,
    },
    dirty: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['expand', 'collapse'],
}
</script>
