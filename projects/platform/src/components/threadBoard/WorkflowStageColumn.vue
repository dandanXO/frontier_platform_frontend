<template lang="pug">
div
  div(
    v-show="isExpanded"
    class="w-82.5 flex-shrink-0 h-full max-h-full rounded-md flex flex-col overflow-hidden bg-grey-100"
    :class="[{ 'bg-primary-0 outline-primary-300 outline outline-1 -outline-offset-1': active }]"
  )
    div(class="p-2")
      div(class="flex-shrink-0 h-8 pl-3 flex flex-row justify-between items-center")
        div(class="handle flex-1 flex flex-row gap-2 items-center")
          div(class="flex-1 flex flex-row items-center gap-3")
            div(class="flex flex-row items-center gap-1.5")
              f-svg-icon(
                v-if="workflowStage.isDefault"
                iconName="unsorted"
                size="20"
                class="text-grey-400"
              )
              span(class="text-body2 text-grey-900 font-bold") {{ workflowStage.workflowStageName }}
            span(class="text-body2 text-grey-600") {{ workflowStage.digitalThreadList.length }}
        div(class="w-8 h-8 flex items-center justify-center")
          icon-button(iconName="more_horiz" size="24")
        div(
          v-if="workflowStage.isDefault"
          class="w-8 h-8 flex items-center justify-center"
        )
          icon-button(
            iconName="double_arrow_left"
            size="24"
            @click.stop="handleWorkflowStageCollapse"
          )
    div(class="relative h-full")
      f-scrollbar-container(
        :ref="(el) => (scrollContainer = el)"
        class="h-full"
        @scrollInfoChange="handleScroll"
      )
        slot(:scrollContainer="scrollContainer")
      div(v-if="showUpperBound" class="absolute top-0 left-0 h-[1px] w-full bg-grey-200")
      div(
        v-if="showBottomBound"
        class="absolute bottom-0 left-0 h-[1px] w-full bg-grey-200"
      )
  div(
    v-show="!isExpanded"
    class="h-full w-8 p-1.5 flex flex-col items-center cursor-pointer"
  )
    div(class="flex flex-col items-center gap-2")
      div(v-if="haveUnreadThread" class="w-5 h-5 flex items-center justify-center")
        p(class="bg-primary-400 w-2 h-2 rounded-full") 
      icon-button(v-else iconName="double_arrow_right" size="20")
      p(
        class="flex gap-2 font-bold [writing-mode:vertical-lr] rotate-180"
        :class="haveUnreadThread ? 'text-primary-500' : 'text-grey-800'"
      )
        span(
          class="text-caption flex items-center"
          :class="{ 'rotate-90 leading-2': isZh }"
        ) {{ workflowStage.digitalThreadList.length }}
        span(
          class="text-body2 flex items-center"
          :class="{ 'rotate-180 [letter-spacing:.1rem]': isZh }"
        ) {{ workflowStage.workflowStageName }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import IconButton from '@/components/threadBoard/IconButton.vue'
import type overlayscrollbars from 'overlayscrollbars'
import type FScrollbarContainer from '@frontier/ui-component/src/FScrollbarContainer/FScrollbarContainer.vue'
import type { WorkflowStage } from '@frontier/platform-web-sdk'

const emit = defineEmits<{
  (e: 'workflowStageCollapse'): void
}>()

const props = withDefaults(
  defineProps<{
    workflowStage: WorkflowStage
    active?: boolean
    isExpanded?: boolean
  }>(),
  { active: false, isExpanded: true }
)

const store = useStore()

const scrollContainer = ref<InstanceType<typeof FScrollbarContainer>>()
const showUpperBound = ref(false)
const showBottomBound = ref(false)

const user = computed(() => store.getters['user/user'])
const isZh = computed(() => user.value.locale === 'zh-TW')
const haveUnreadThread = computed(() => {
  return props.workflowStage.digitalThreadList.some(
    (thread) => thread.unreadStickerQty > 0
  )
})

const handleWorkflowStageCollapse = () => {
  emit('workflowStageCollapse')
}

const handleScroll = (scrollInfo: overlayscrollbars.ScrollInfo) => {
  showUpperBound.value = scrollInfo.ratio.y > 0
  if (scrollInfo.handleLengthRatio.y < 1 && scrollInfo.ratio.y !== 1) {
    showBottomBound.value = true
  } else {
    showBottomBound.value = false
  }
}
</script>

<style scoped></style>
