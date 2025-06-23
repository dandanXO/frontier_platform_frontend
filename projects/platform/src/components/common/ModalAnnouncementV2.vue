<template>
  <div
    class="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-grey-900/40 z-100"
    @click="onClose"
  >
    <div
      class="bg-white max-w-[600px] min-w-90 p-6 w-min rounded-xl custom-shadow flex flex-col justify-start items-center gap-6"
    >
      <img
        v-if="content?.[contentIdx].img"
        class="w-[416px] h-70 min-w-[416px] min-h-70 bg-grey-50-v1 rounded-lg text-grey-950-v1"
        :src="content?.[contentIdx].img"
        :alt="content?.[contentIdx].title"
      />
      <div class="flex flex-col gap-1 max-w-[416px]">
        <p class="text-base font-bold truncate text-grey-950-v1">
          {{ content?.[contentIdx].title }}
        </p>
        <p class="overflow-y-auto text-sm max-h-24 text-grey-900-v1">
          {{ content?.[contentIdx].description }}
        </p>
      </div>
      <div class="flex items-center justify-between w-full gap-4">
        <div class="flex items-center gap-2 p-2 rounded bg-green-50-v1">
          <button
            v-for="(_, index) in content"
            :key="index"
            class="w-2 h-2 rounded-full"
            :class="[contentIdx === index ? 'bg-green-500-v1' : 'bg-green-100']"
            @click="contentIdx = index"
          />
        </div>
        <div class="flex gap-3">
          <f-button
            version="v2"
            type="secondary"
            size="md"
            @click="secondaryBtnClick"
          >
            {{ content[contentIdx].secondaryBtnText }}
          </f-button>
          <f-button
            version="v2"
            type="primary"
            size="md"
            @click="
              ;[
                contentIdx < content.length - 1
                  ? contentIdx++
                  : primaryBtnClick(),
              ]
            "
          >
            {{ content[contentIdx].primaryBtnText }}
          </f-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  onClose: () => void
  content: Array<{
    img?: string
    title: string
    description: string
    secondaryBtnText: string
    primaryBtnText: string
  }>
  primaryBtnClick: () => void
  secondaryBtnClick: () => void
}>()
const contentIdx = ref(0)
</script>

<style scoped>
.custom-shadow {
  box-shadow: 0px 4px 8px 0px rgba(19, 20, 20, 0.05),
    0px 0px 8px 0px rgba(19, 20, 20, 0.1);
}
</style>
