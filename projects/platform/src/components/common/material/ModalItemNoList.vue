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
        v-for="(itemNo, index) in itemNoList"
        :key="itemNo"
        class="flex gap-3 border-grey-250 py-2.5 text-body2 text-grey-900 leading-1.6"
        :class="{ 'border-b': index !== itemNoList.length - 1 }"
      )
        div(class="w-31 pl-15 font-bold flex-shrink-0") {{ index + 1 }}
        div {{ itemNo }}
</template>

<script setup lang="ts">
export interface PropsModalItemNoList {
  header: string
  primaryBtnText?: string
  secondaryBtnText?: string
  primaryBtnHandler?: () => void
  secondaryBtnHandler?: () => void
  itemNoList: string[]
}

defineProps<PropsModalItemNoList>()
</script>
