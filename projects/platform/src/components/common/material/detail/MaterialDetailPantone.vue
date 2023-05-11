<template lang="pug">
div
  h5(class="text-h5 font-bold text-grey-900 pb-3") {{ $t('RR0131') }}
  div(class="flex items-center gap-x-2")
    div(v-for="pantone in pantoneList" :key="pantone.name")
      f-tooltip-media(
        placement="right-end"
        :pantone="{ r: pantone.r, g: pantone.g, b: pantone.g }"
        :tooltipTitle="pantone.name"
        :tooltipMessage="pantone.colorName"
      )
        template(#slot:tooltip-trigger)
          div(
            class="rounded w-5.5 h-5.5"
            :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }"
          )
</template>

<script>
export default {
  name: 'BlockMaterialPantone',
  props: {
    pantoneList: {
      type: Array,
      required: true,
    },
  },
}
</script>
