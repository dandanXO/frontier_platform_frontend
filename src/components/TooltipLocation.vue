<template lang="pug">
tooltip(placement="bottom")
  template(#trigger="{ isActive }")
    svg-icon(iconName="location_on" size="14" :class="[isActive ? 'text-brand' : 'text-black-500']")
  template(#content)
    div(class="px-3 py-1 flex items-center max-w-85 flex-wrap")
      template(v-for="(path, index) in location")
        p(class="text-primary" :class="[ index === location.length - 1 ? 'font-bold' :'font-normal']") {{path}}
        svg-icon(v-if="index !== location.length - 1" size="20" iconName="slash" class="text-black-500")
</template>

<script>
export default {
  name: 'TooltipLocation',
  props: {
    location: {
      type: Array,
      required: true
    }
  }
}
</script>
