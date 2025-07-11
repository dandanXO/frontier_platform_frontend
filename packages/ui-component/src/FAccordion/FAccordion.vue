<template>
  <div
    class="flex flex-col border border-primary-border"
    :class="[containerClasses, className]"
  >
    <div
      id="f-accordion-header"
      class="flex flex-row items-center justify-between gap-3"
      :class="[
        headerClasses,
        {
          'border-b border-b-primary-border': closedFully,
        },
        headerBorderRadius,
        {
          'hover:bg-primary-hover cursor-pointer select-none': !viewOnly,
        },
        headerClass,
      ]"
      @click="toggleContent"
    >
      <div>
        <div class="flex items-center gap-1">
          <p
            id="f-accordion-title"
            class="text-xl font-bold text-primary-inverse line-clamp-2"
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
              <f-svg-icon
                iconName="question"
                size="16"
                class="text-cyan-500-v1"
              />
            </template>
          </f-tooltip>
        </div>
        <p class="text-sm text-secondary-text line-clamp-4">
          {{ desc }}
        </p>
        <f-button
          
          v-if="viewOnly && actionButton"
          :type="'secondary'"
          :size="'sm'"
          :version="'v2'"
          @click.stop="actionButton.onClick()"
          class="mt-2"
        >
          <f-svg-icon
            v-if="actionButton.iconName"
            :iconName="actionButton.iconName"
            size="16"
            class="mr-2"
          />
          {{ actionButton.text }}
        </f-button>
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
      <div class="p-6" :class="contentContainerClass">
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
import {
  Comment,
  computed,
  isVNode,
  ref,
  toRefs,
  useSlots,
  watch,
  nextTick,
  onMounted,
} from 'vue'
import FTooltip from '../FTooltip/FTooltip/FTooltip.vue'
import { FUNC_ID } from '@/utils/constants'

interface Props {
  className?: string
  title: string
  desc?: string
  contentContainerClass?: string
  viewOnly?: boolean
  headerClass?: string
  headerTooltip?: {
    title?: string
    desc?: string
  }
  actionButton?: {
    text: string
    iconName?: string
    onClick: () => void
  }
  defaultExpanded?: boolean
  variant?: 'default' | 'compact'
}
const props = defineProps<Props>()
const { viewOnly } = toRefs(props)
const slots = useSlots()

// Variant-specific styling
const containerClasses = computed(() => {
  const variant = props.variant || 'default'
  return {
    'rounded-2xl': variant === 'default',
    'rounded-lg': variant === 'compact',
  }
})

const headerClasses = computed(() => {
  const variant = props.variant || 'default'
  return {
    'p-6': variant === 'default',
    'p-5': variant === 'compact',
  }
})

const headerBorderRadius = computed(() => {
  const variant = props.variant || 'default'
  return {
    'rounded-t-2xl': variant === 'default' && closedFully.value,
    'rounded-2xl': variant === 'default' && !closedFully.value,
    'rounded-t-lg': variant === 'compact' && closedFully.value,
    'rounded-lg': variant === 'compact' && !closedFully.value,
  }
})
const hasDefaultSlot = computed(() => {
  const slotContent = slots.default?.() ?? []
  return slotContent.some((vnode) => isVNode(vnode) && vnode.type !== Comment)
})

const isShowContent = ref(props.defaultExpanded || false)
const closedFully = ref(false)
const wrapperHeight = ref('0px')
const contentWrapper = ref<HTMLElement | null>(null)

const toggleContent = () => {
  isShowContent.value = !isShowContent.value
}

// Watch for changes in isShowContent and viewOnly
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

// Watch for changes in defaultExpanded prop
watch(
  () => props.defaultExpanded,
  (newValue) => {
    if (newValue !== undefined) {
      isShowContent.value = newValue
    }
  },
  { immediate: true }
)

// Initialize the accordion state when component mounts
onMounted(() => {
  if (props.defaultExpanded && contentWrapper.value && !props.viewOnly) {
    // Trigger the height animation for initial expanded state
    nextTick(() => {
      const fullHeight = contentWrapper.value!.scrollHeight
      closedFully.value = true
      wrapperHeight.value = `${fullHeight}px`

      setTimeout(() => {
        wrapperHeight.value = 'auto'
      }, 200)
    })
  }
})
</script>

<style scoped>
.transition-height {
  transition: height 0.2s ease-in-out;
  overflow: hidden;
}
</style>
