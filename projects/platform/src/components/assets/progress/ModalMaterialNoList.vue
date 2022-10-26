<template lang="pug">
modal-behavior(
  :header="header"
  :primaryBtnText="primaryBtnText"
  :secondaryBtnText="secondaryBtnText"
  @click:primary="primaryBtnHandler"
  @click:secondary="secondaryBtnHandler"
)
  div(class="w-94")
    f-scrollbar-container(class="max-h-89.5")
      div(
        v-for="(materialNo, index) in materialNoList"
        class="flex gap-3 border-grey-200 py-2.5 text-body2 text-grey-900 leading-1.6"
        :class="{ 'border-b': index !== materialNoList.length - 1 }"
      )
        div(class="w-31 pl-15 font-bold flex-shrink-0") {{ index + 1 }}
        div {{ materialNo }}
</template>

<script setup>
defineProps({
  header: {
    type: String,
  },
  primaryBtnText: {
    type: String,
  },
  secondaryBtnText: {
    type: String,
  },
  primaryBtnHandler: {
    type: Function,
  },
  secondaryBtnHandler: {
    type: Function,
  },
  materialNoList: {
    type: Array,
    required: true,
  },
})
</script>
