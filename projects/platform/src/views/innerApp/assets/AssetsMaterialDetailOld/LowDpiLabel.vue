<style lang="scss">
$size: 12px;
$location: 12px;
div[role='popper'] {
  &[data-popper-placement='top-start'] #arrow {
    left: 10%;
    transform: translateX(-20%);
    bottom: $location;
    &::before {
      left: -6px;
    }
  }

  &[data-popper-placement='top-end'] #arrow {
    left: 90%;
    transform: translateX(-20%);
    bottom: $location;
    &::before {
      left: -6px;
    }
  }

  &[data-popper-placement='bottom-start'] #arrow {
    top: -$location;
    left: 10%;
    transform: translateX(-50%);
    &::before {
      left: -6px;
      transform: rotate(180deg);
    }
  }

  &[data-popper-placement='bottom-end'] #arrow {
    top: -$location;
    left: 90%;
    transform: translateX(-50%);
    &::before {
      left: -6px;
      transform: rotate(180deg);
    }
  }
}

#arrow,
#arrow::before {
  visibility: visible;
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-left: $size solid transparent;
  border-right: $size solid transparent;
  border-top: $size solid #fafcfc;
  /* border-top: $size solid red; */
  background: transparent;
  z-index: 1000;
}

#arrow {
  visibility: hidden;
  @apply bg-transparent;
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
)
  f-badge(type="warning" class="cursor-help whitespace-nowrap overflow-auto") &lt; {{MIN_DPI_2D_MATERIAL}} DPI
  div(
    ref="refPopper"
    role="popper"
    class="z-popper w-[328px]"
    :class="[customClassPopper]"
    :onmouseleave="collapsePopper"
    :onclick="(e:Event) => e.stopPropagation()"
    v-if="isExpand"
  )
    div(class="rounded-sm p-4 z-popper bg-white flex flex-col gap-4 shadow")
      p(class="font-normal text-xs") {{ $t('DD0158') }}
      f-button(size="sm" type="secondary" @click="onReplaceImage" v-if="isReplaceImageEnabled") {{ $t('DD0159') }}
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
import { createPopper } from '@popperjs/core'
import { noop } from '@vueuse/core'
import { computed, nextTick, ref } from 'vue'
import { useStore } from 'vuex'

interface Props {
  material?: Material
  materialOptions?: MaterialOptions
}

const props = defineProps<Props>()

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
    placement: TOOLTIP_PLACEMENT.BOTTOM_END,
    modifiers: [
      {
        name: 'placementListener',
        phase: 'main',
        enabled: true,
        fn: (properties) => {
          const {
            state: { placement },
          } = properties

          if (!placement) {
            return
          }
          const stylePopper = {
            [TOOLTIP_PLACEMENT.BOTTOM_START]: 'pt-2',
            [TOOLTIP_PLACEMENT.BOTTOM_END]: 'pt-2',
            [TOOLTIP_PLACEMENT.TOP_START]: 'pb-2',
            [TOOLTIP_PLACEMENT.TOP_END]: 'pb-2',
          }

          // no need to get the placement right
          // by giving empty string as the default value
          // will solved the issue
          // @ts-expect-error
          customClassPopper.value = stylePopper[placement] ?? ''

          return properties.state
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
