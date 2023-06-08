<template lang="pug">
modal-behavior(
  :header="title"
  :secondaryBtnText="$t('UU0094')"
  @click:secondary="closeModalBehavior"
)
  div(class="w-94")
    div(class="flex flex-col gap-y-2")
      p(class="text-body2 text-grey-900") {{ content }}
      f-scrollbar-container(class="max-h-90")
        div(class="flex flex-col items-stretch border border-grey-150 rounded")
          div(
            v-for="(unit, index) in errorList"
            :key="index"
            class="w-full h-11 flex items-center px-4 text-body2 gap-x-2"
            :class="index === errorList.length - 1 ? 'border-b-0' : 'border-b border-grey-150'"
          )
            span(
              class="w-3 h-3 rounded-sm"
              :style="{ backgroundColor: unit.labelColor }"
            )
            p(class="text-body2") {{ unit.ogName }}
    f-infobar(class="mt-26" :messageText="$t('TT0157')")
</template>

<script setup lang="ts">
import { useStore } from 'vuex'

defineProps<{
  title: string
  content: string
  errorList: {
    ogName: string
    labelColor: string
  }[]
}>()

const store = useStore()
const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')
</script>
