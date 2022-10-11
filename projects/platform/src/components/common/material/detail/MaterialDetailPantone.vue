<template lang="pug">
div
  h5(class="text-h5 font-bold text-grey-900 pb-3") {{ $t("RR0131") }}
  div(class="flex items-center gap-x-2")
    div(v-for="pantone in pantoneList")
      f-tooltip(placement="right-end")
        template(#trigger)
          div(class="rounded w-5.5 h-5.5"  :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
        template(#content)
          div(class="w-26.5 pt-0.5")
            div(class="w-full aspect-square rounded-t"  :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
            div(class="text-caption text-grey-50 leading-1.3 mt-1.5")
              p {{ pantone.name }}
              p {{ pantone.colorName }}
</template>

<script>
export default {
  name: 'BlockMaterialPantone',
  props: {
    pantoneList: {
      type: Array,
      required: true
    }
  }
}
</script>
