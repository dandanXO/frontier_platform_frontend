<template lang="pug">
f-tooltip
  template(#trigger="{ isActive }")
    f-svg-icon(
      iconName="location_on"
      size="14"
      :class="[isActive ? 'text-primary-400' : 'text-grey-250']"
    )
  template(#content)
    div(class="flex items-center flex-wrap")
      template(v-for="(path, index) in location")
        p(
          class="text-grey-50 text-caption leading-1.3"
          :class="[index === location.length - 1 ? 'font-bold' : 'font-normal']"
        ) {{ path }}
        f-svg-icon(
          v-if="index !== location.length - 1"
          size="20"
          iconName="slash"
          class="text-grey-50"
        )
</template>

<script>
export default {
  name: 'TooltipLocation',
  props: {
    location: {
      type: Array,
      required: true,
    },
  },
}
</script>
