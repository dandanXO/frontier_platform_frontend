<template lang="pug">
f-tooltip-standard
  template(#slot:tooltip-trigger="{ isActive }")
    f-svg-icon(
      iconName="location_on"
      size="14"
      :class="[isActive ? 'text-primary-400' : 'text-grey-250']"
    )
  template(#slot:tooltip-content)
    div(class="flex items-center flex-wrap")
      template(v-for="(location, index) in locationList" :key="location.name")
        p(
          class="text-grey-50 text-caption leading-1.3"
          :class="[index === locationList.length - 1 ? 'font-bold' : 'font-normal']"
        ) {{ location.name }}
        f-svg-icon(
          v-if="index !== locationList.length - 1"
          size="20"
          iconName="slash"
          class="text-grey-50"
        )
</template>

<script setup lang="ts">
defineProps<{
  locationList: {
    name: string
    nodeId: number
  }[]
}>()
</script>
