<template lang="pug">
div
  div(class="flex items-center mb-6 text-grey-900")
    h5(class="text-h5 font-bold") {{ $t('RR0132') }}
    f-popper(placement="top" class="pl-1" showArrow)
      template(#trigger)
        f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
      template(#content="{ collapsePopper }")
        div(class="p-5")
          span(
            class="text-body2 text-cyan-400 underline leading-1.6 cursor-pointer"
            @click="openModalU3mInstruction(); collapsePopper()"
          ) {{ $t('UU0029') }}
  p(class="text-caption text-grey-600 font-bold leading-1.6 mb-1") {{ $t('EE0017') }}
    f-svg-icon(
      v-if="status === IN_QUEUE || status === PROCESSING"
      iconName="loading"
      size="16"
      class="text-primary-400 inline-block ml-2"
    )
  div(
    v-if="status === INITIAL || status === UNQUALIFIED"
    class="flex items-center bg-grey-50 w-fit px-3.5 h-8.5 rounded mb-6"
  )
    p(class="text-body2 text-grey-900") {{ $t('EE0019') }}
  div(
    v-else
    class="flex items-center bg-grey-50 w-fit px-3.5 h-8.5 rounded mb-6"
    @click="goToProgress('u3m')"
  )
    div(class="w-3 h-3 rounded-sm mr-2.5" :class="[label.color]")
    p(class="text-body2 text-grey-900") {{ label.text }}
  div(class="flex items-center")
    f-button(
      size="md"
      type="secondary"
      :disabled="status !== COMPLETED"
      @click="openModalModelEditor"
    ) {{ $t('UU0006') }}
    material-u3m-files(:material="material")
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'
import MaterialU3mFiles from '@/components/common/material/u3m/MaterialU3mFiles.vue'
import { U3M_STATUS } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'
import useModelEditor from '@/composables/useModelEditor'

const props = defineProps({
  material: {
    type: Object,
    required: true,
  },
})

const material = computed(() => props.material)
const status = computed(() => material.value.u3m.status)

const { t } = useI18n()
const store = useStore()
const { goToProgress } = useNavigation()
const { openModalModelEditor } = useModelEditor(material)
const { UNQUALIFIED, INITIAL, IN_QUEUE, COMPLETED, PROCESSING, UNSUCCESSFUL } =
  U3M_STATUS

const openModalU3mInstruction = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-u3m-instruction',
    properties: {
      primaryBtnText: t('UU0094'),
      primaryHandler: () => {
        store.dispatch('helper/closeModalBehavior')
      },
    },
  })
}

const label = computed(() => {
  let text
  let color
  switch (status.value) {
    case IN_QUEUE:
      text = t('PP0004')
      color = 'bg-cyan-300'
      break
    case COMPLETED:
      text = t('PP0006')
      color = 'bg-primary-400'
      break
    case PROCESSING:
      text = t('PP0005')
      color = 'bg-yellow-400'
      break
    case UNSUCCESSFUL:
      text = t('PP0007')
      color = 'bg-red-400'
      break
  }

  return { text, color }
})
</script>
