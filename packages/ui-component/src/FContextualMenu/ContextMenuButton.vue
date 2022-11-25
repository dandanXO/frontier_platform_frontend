<template lang="pug">
div(:class="[position === 'top' ? 'flex-col' : 'flex-col-reverse']" class="flex")
  div(
    :class="{ 'hover:bg-grey-100 active:bg-grey-150': !disabled }"
    class="group h-8.5 px-4 flex items-center"
    @click="!disabled && !!clickHandler && clickHandler()"
  )
    f-svg-icon(
      :iconName="icon"
      size="20"
      :class="[disabled ? 'text-grey-150' : 'text-primary-400 group-hover:text-primary-500']"
      class="mr-2"
    )
    p(
      :class="[disabled ? 'text-grey-150' : 'text-primary-400 group-hover:text-primary-00']"
      class="text-body2"
    ) {{ text }}
  div(:class="[position === 'top' ? 'mt-1' : 'mb-1']" class="w-full h-0.5 bg-grey-150")
</template>

<script>
export default {
  name: 'ContextualMenuButton',
}
</script>

<script setup>
defineProps({
  position: {
    type: String,
    default: 'top', // top or bottom
  },
  icon: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  clickHandler: {
    type: String,
    default: () => {},
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>
