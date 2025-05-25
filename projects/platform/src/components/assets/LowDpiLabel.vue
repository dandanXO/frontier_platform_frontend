<style lang="scss" scoped>
#arrow,
#arrow::before {
  z-index: 10001 !important;
  position: absolute;
  width: 12px !important;
  height: 12px !important;
}

#arrow {
  visibility: hidden;
}

#arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg) !important;
  background-color: var(--color-primary) !important;
  @apply shadow-md;
  border-width: 0 !important;
}

/* Position the arrow correctly based on placement */
.popup-container[data-popper-placement^='top'] #arrow {
  bottom: 65% !important;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1); /* Shadow for bottom when arrow points down */
}

.popup-container[data-popper-placement^='bottom'] #arrow {
  top: -10px !important;
  @apply shadow-md;
}

.popup-container[data-popper-placement^='left'] #arrow {
  right: -0px !important;
  @apply shadow-md;
}

.popup-container[data-popper-placement^='right'] #arrow {
  left: -12px !important;
  @apply shadow-md;
}
</style>

<template lang="pug">
div(
  ref="refTrigger"
  aria-describedby="popper"
  :onmousemove="expandPopper"
  :onmouseleave="collapsePopper"
  v-bind="$attrs"
  data-cy="f-popper"
  :data-theme="theme"
)
  f-badge(type="warning" class="cursor-help whitespace-nowrap overflow-auto") &lt; {{MIN_DPI_2D_MATERIAL}} DPI
  div(
    ref="refPopper"
    role="popper"
    class="z-popper w-[328px] popup-container"
    :class="[customClassPopper]"
    :onmouseleave="collapsePopper"
    :onclick="(e:Event) => e.stopPropagation()"
    v-if="isExpand"
  )
    div(class="rounded-sm p-4 z-popper bg-primary text-primary-inverse flex flex-col gap-4 shadow")
      p(class="font-normal text-xs") {{ $t('DD0158') }}
      f-button(size="sm" :type="theme? btnType[theme] : 'secondary'" @click="onReplaceImage" v-if="isReplaceImageEnabled") {{ $t('DD0159') }}
    #arrow
</template>

<script lang="ts" setup>
import useMaterialForm from '@/composables/material/useMaterialForm'
import useMultimediaUpdate from '@/composables/material/useMultimediaUpdate'
import { MIN_DPI_2D_MATERIAL, TOOLTIP_PLACEMENT } from '@frontier/constants'
import type {
  Material,
  MaterialOptions,
  PantoneColor,
} from '@frontier/platform-web-sdk'
import { type BtnType } from '@frontier/ui-component/src/FButton/FButton.vue'
import { createPopper } from '@popperjs/core'
import { noop } from '@vueuse/core'
import { computed, nextTick, ref } from 'vue'
import { useStore } from 'vuex'

interface Props {
  material?: Material
  materialOptions?: MaterialOptions
  placement?: TOOLTIP_PLACEMENT
  offset?: [number, number]
  theme?: 'new' | 'new-dark' | 'primary'
}

const props = defineProps<Props>()

const btnType: Record<string, BtnType> = {
  new: 'secondary',
  'new-dark': 'primary',
  startrust: 'primary',
}

const store = useStore()

const isExpand = ref(false)
const refTrigger = ref<HTMLElement>()
const refPopper = ref<HTMLElement>()
const customClassPopper = ref('')

const pantoneList = store.getters['code/pantoneList'] as PantoneColor[]

const expandPopper = async () => {
  if (isExpand.value) {
    return
  }

  isExpand.value = true

  await nextTick()
  if (!refTrigger.value || !refPopper.value) {
    return
  }

  createPopper(refTrigger.value, refPopper.value, {
    placement: props.placement ?? TOOLTIP_PLACEMENT.BOTTOM_END,
    modifiers: [
      {
        name: 'placementListener',
        phase: 'main',
        enabled: true,
      },
      {
        name: 'offset',
        options: {
          offset: props.offset,
        },
      },
    ],
  })
}

const materialFormService = computed(() =>
  props.materialOptions
    ? useMaterialForm({
        material: props.material,
        materialOptions: props.materialOptions!,
        pantoneList,
      })
    : { updatePantoneList: noop }
)

const multimediaUpdateService = computed(() =>
  props.material
    ? useMultimediaUpdate(
        ref(props.material),
        materialFormService.value.updatePantoneList
      )
    : undefined
)

const onReplaceImage = (e: Event) => {
  e.stopPropagation()
  collapsePopper()
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-scanned-image-update',
    properties: { multimediaUpdateService },
  })
}

const collapsePopper = () => {
  isExpand.value = false
}

const isReplaceImageEnabled = computed(
  () => props.material && props.materialOptions
)
</script>
