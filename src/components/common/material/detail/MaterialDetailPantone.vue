<template lang="pug">
div
  h5(class="text-h5 font-bold text-primary pb-3") {{ $t("RR0131") }}
  div(class="flex items-center gap-x-2")
    div(v-for="pantone in pantoneList")
      tooltip(placement="right")
        template(#trigger)
          div(class="rounded w-5.5 h-5.5" :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
        template(#content)
          div(class="w-30 h-11 relative")
            div(class="w-30 h-30 absolute -top-29 rounded-t" :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
            div(class="p-2 text-primary text-caption font-bold")
              div(class="pb-1") {{ pantone.name }}
              div {{ pantone.colorName }}
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
