<template lang="pug">
div(
  v-if="isCreatingWorkflowStage"
  class="w-86 h-full max-h-full flex-shrink-0 bg-grey-0 border border-dashed border-grey-250 p-2 flex flex-col gap-y-2"
)
  div(class="p-2 flex flex-col gap-2")
    f-input-text(
      v-model:textValue="creatingWorkflowStageName"
      :placeholder="$t('TT0148')"
    )
    div(class="flex flex-row gap-2")
      f-button(
        size="md"
        type="primary"
        :disabled="!valid"
        @click="createWorkflowStage"
      ) {{ $t('UU0020') }}
      f-button(size="md" type="text" @click="cancelCreateWorkflowStage") {{ $t('UU0002') }}
  f-scrollbar-container(class="h-full" :ref="(el) => (scrollContainer = el)")
    slot(name="content" :scrollContainer="scrollContainer")
div(
  v-else
  class="relative w-12 h-full max-h-full flex-shrink-0 rounded border border-dashed border-grey-250 cursor-pointer"
  @click="isCreatingWorkflowStage = true"
)
  slot(name="toggle")
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useThreadBoardStore from '@/stores/threadBoard'
import type FScrollbarContainer from '@frontier/ui-component/src/FScrollbarContainer/FScrollbarContainer.vue'

const threadBoardStore = useThreadBoardStore()
const { isCreatingWorkflowStage, creatingWorkflowStageName } =
  storeToRefs(threadBoardStore)
const { createWorkflowStage, cancelCreateWorkflowStage } = threadBoardStore

const scrollContainer = ref<InstanceType<typeof FScrollbarContainer>>()

const valid = computed(() => !!creatingWorkflowStageName.value)
</script>

<style scoped></style>
