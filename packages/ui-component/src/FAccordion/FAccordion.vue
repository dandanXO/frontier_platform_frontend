<template>
  <div
    class="flex flex-col border border-primary-border rounded-lg"
    :class="className"
  >
    <div
      id="f-accordion-header"
      class="flex flex-row gap-3 items-center justify-between p-6"
      :class="[
        {
          'border-b border-b-primary-border': closedFully,
        },
        closedFully ? 'rounded-t-lg' : 'rounded-lg',
        {
          'hover:bg-primary-hover cursor-pointer select-none': !viewOnly,
        },
      ]"
      @click="toggleContent"
    >
      <div>
        <div class="flex items-center gap-1">
          <p
            id="f-accordion-title"
            class="text-primary-inverse font-bold text-xl line-clamp-2"
          >
            {{ title }}
          </p>

          <f-tooltip
            v-if="headerTooltip?.title || headerTooltip?.desc"
            :title="headerTooltip?.title"
            :desc="headerTooltip?.desc"
            :placement="TOOLTIP_PLACEMENT.RIGHT"
            data-theme="new"
            classContent="w-80"
            :offset="[0, 10]"
            class="self-center"
            interactive
            isDescHTML
          >
            <template #slot:tooltip-trigger>
              <f-svg-icon iconName="question" size="16" class="text-cyan-500" />
            </template>
          </f-tooltip>
        </div>
        <p class="text-secondary-text text-sm line-clamp-4">
          {{ desc }}
        </p>
      </div>

      <f-svg-icon
        v-if="!viewOnly"
        :iconName="`chevron_${isShowContent ? 'up' : 'down'}`"
        size="24"
      />
    </div>
    <div
      ref="contentWrapper"
      :class="{ 'transition-height': !viewOnly }"
      :style="{ height: viewOnly ? undefined : wrapperHeight }"
      v-if="hasDefaultSlot"
    >
      <div class="p-5" :class="contentContainerClass">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'FAccordion' }
</script>

<script setup lang="ts">
import { TOOLTIP_PLACEMENT } from '@frontier/constants'
import { Comment, computed, isVNode, ref, toRefs, useSlots, watch } from 'vue'

interface Props {
  className?: string
  title: string
  desc?: string
  contentContainerClass?: string
  viewOnly?: boolean
  headerTooltip?: {
    title?: string
    desc?: string
  }
}
const props = defineProps<Props>()
const { viewOnly } = toRefs(props)
const slots = useSlots()
const hasDefaultSlot = computed(() => {
  const slotContent = slots.default?.() ?? []
  return slotContent.some((vnode) => isVNode(vnode) && vnode.type !== Comment)
})

const isShowContent = ref(false)
const closedFully = ref(false)
const wrapperHeight = ref('0px')
const contentWrapper = ref<HTMLElement | null>(null)

const toggleContent = () => {
  isShowContent.value = !isShowContent.value
}

watch([isShowContent, viewOnly], ([isExpand, isViewMode]) => {
  if (contentWrapper.value && !isViewMode) {
    // Ensure starting height
    const fullHeight = contentWrapper.value.scrollHeight
    isExpand && (closedFully.value = isExpand)

    wrapperHeight.value = `${fullHeight}px`

    /**
     * if expand, Match the timeout value with CSS transation (0.5s = 500)
     * if colapsed, set timeout to 0, so the CSS animation can run
     */
    const timeout = isExpand ? 200 : 0
    setTimeout(() => {
      setTimeout(() => {
        closedFully.value = isExpand
      }, timeout)
      wrapperHeight.value = isExpand ? 'auto' : '0px'
    }, timeout)
  }
})
</script>

<style scoped>
.transition-height {
  transition: height 0.2s ease-in-out;
  overflow: hidden;
}
</style>
