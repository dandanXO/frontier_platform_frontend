<template lang="pug">
modal-behavior(
  :header="$t('UU0029')"
  :primaryBtnText="primaryBtnText"
  :secondaryBtnText="secondaryBtnText"
  @click:primary="primaryHandler"
  @click:secondary="secondaryHandler"
)
  div(class="w-180 flex justify-between")
    p(class="text-body2 leading-1.6 text-black-800 w-102") {{ $t("EE0066") }}
    img(src="@/assets/images/u3m.png" class="w-70")
</template>

<script setup>
defineProps({
  primaryBtnText: {
    type: String
  },
  primaryHandler: {
    type: Function
  },
  secondaryBtnText: {
    type: String
  },
  secondaryHandler: {
    type: Function
  }
})
</script>
