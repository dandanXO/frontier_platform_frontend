import { ref, nextTick, watch, type Ref } from 'vue'
import type { TOOLTIP_PLACEMENT } from '../constants'
import { createPopper } from '@popperjs/core'

export const useTooltip = ({
  disabledTooltip,
  boundaryReference,
  offset,
  placement,
  emit,
}: {
  disabledTooltip: Ref<boolean>
  offset: Ref<[number, number]>
  boundaryReference?: Ref<string | undefined>
  placement: Ref<TOOLTIP_PLACEMENT>
  emit: any
}) => {
  const refTrigger = ref<HTMLElement>()
  const refTooltip = ref<HTMLElement>()
  const isActive = ref(false)
  const isHovering = ref(false)
  type Timeout = ReturnType<typeof setTimeout>
  const timer = ref<Timeout>()

  const showTooltip = () => {
    timer.value = setTimeout(async () => {
      if (disabledTooltip.value) {
        return
      }

      isActive.value = true

      await nextTick()

      /**
       * @typescript
       */
      const modifiers: any[] = [
        {
          name: 'offset',
          options: {
            offset: offset.value,
          },
        },
      ]

      if (boundaryReference?.value) {
        modifiers.push({
          name: 'preventOverflow',
          options: {
            boundary: document.querySelector(
              `[data-tooltip-boundary-reference="${boundaryReference.value}"]`
            ),
          },
        })
      }

      if (refTrigger.value && refTooltip.value) {
        createPopper(refTrigger.value, refTooltip.value, {
          placement: placement.value,
          modifiers,
        })
      }
      emit('show')
    }, 500)
  }

  const hideTooltip = () => {
    clearTimeout(timer.value)
    isActive.value = false
    emit('hide')
  }

  const mouseenterHandler = () => {
    isHovering.value = true
    showTooltip()
  }

  const mouseleaveHandler = () => {
    isHovering.value = false
    hideTooltip()
  }

  watch(
    () => disabledTooltip.value,
    () => {
      if (disabledTooltip.value) {
        hideTooltip()
      }

      if (!disabledTooltip.value && isHovering.value) {
        showTooltip()
      }
    }
  )

  return {
    refTrigger,
    refTooltip,
    isActive,
    mouseenterHandler,
    mouseleaveHandler,
  }
}
