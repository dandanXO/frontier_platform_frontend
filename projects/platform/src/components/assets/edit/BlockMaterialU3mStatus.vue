<template lang="pug">
div
  div(class="flex items-center mb-6 text-grey-900")
    h5(class="text-h5 font-bold") {{ $t('RR0132') }}
    f-popper(placement="top" class="pl-1" showArrow)
      template(#trigger)
        f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
      template(#content="{ collapsePopper }")
        div(class="p-5 bg-grey-0 shadow-4 rounded")
          span(
            class="text-body2 text-cyan-400 underline leading-1.6 cursor-pointer"
            @click="openModalU3mInstruction(); collapsePopper()"
          ) {{ $t('UU0029') }}
  p(class="text-caption text-grey-600 font-bold leading-1.6 mb-1") {{ $t('EE0017') }}
    f-svg-icon(
      v-if="material.u3m.status === IN_QUEUE || material.u3m.status === PROCESSING"
      iconName="loading"
      size="16"
      class="text-primary-400 inline-block ml-2"
    )
  div(
    class="flex items-center bg-grey-50 w-fit px-3.5 h-8.5 rounded mb-6"
    :class="{ 'cursor-pointer': !hasNotCreatedU3M }"
    @click="!hasNotCreatedU3M && goToProgress('u3m')"
  )
    div(v-if="label.color" class="w-3 h-3 rounded-sm mr-2.5" :class="[label.color]")
    p(class="text-body2 text-grey-900") {{ label.text }}
  div(class="flex flex-nowrap flex-grow")
    f-button(
      class="flex-shrink-0"
      size="md"
      :type="actionButton.buttonType"
      :disabled="!actionButton.clickHandler"
      @click="actionButton.clickHandler"
    ) {{ actionButton.text }}
    material-u3m-files(:material="material")
  div(
    v-if="material.u3m.status === COMPLETED"
    class="text-grey-900 flex items-center cursor-pointer mt-5.5"
    @click="handleCreateU3m"
  )
    f-svg-icon(iconName="rotate_right" size="20")
    p(class="text-body2 ml-1") {{ $t('UU0030') }}
  i18n-t(
    v-else-if="material.u3m.status === UNSUCCESSFUL"
    keypath="EE0119"
    tag="p"
    class="leading-1.6 mt-2 text-caption text-red-400"
    scope="global"
  )
    template(#newline)
      br
    template(#EE0120)
      span(class="text-cyan-400 ml-0.5 cursor-pointer" @click="handleCreateU3m") {{ $t('EE0120') }}
    template(#RR0123)
      span(class="text-cyan-400 ml-0.5 cursor-pointer" @click="openModalSendFeedback") {{ $t('RR0123') }}
  div(v-else-if="hasNotCreatedU3M" class="grid gap-0.5 mt-2")
    div(
      v-for="requirement in requirementList"
      class="flex items-center"
      :class="[requirement.isMeet ? 'text-primary-400' : 'text-grey-250']"
    )
      f-svg-icon(:iconName="requirement.isMeet ? 'done' : 'clear'" size="16")
      p(class="text-caption ml-1.5 leading-1.6") {{ requirement.text }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'
import MaterialU3mFiles from '@/components/common/material/u3m/MaterialU3mFiles.vue'
import useAssets from '@/composables/useAssets'
import useNavigation from '@/composables/useNavigation'
import { U3M_STATUS } from '@/utils/constants'
import useModelEditor from '@/composables/useModelEditor'

const props = defineProps({
  material: {
    type: Object,
    required: true,
  },
})

const material = computed(() => props.material)

const { t } = useI18n()
const store = useStore()
const { create3DMaterial } = useAssets()
const { goToProgress } = useNavigation()
const { openModalModelEditor } = useModelEditor(material)

const { UNQUALIFIED, INITIAL, IN_QUEUE, COMPLETED, PROCESSING, UNSUCCESSFUL } =
  U3M_STATUS

const hasScannedImage = computed(() => {
  const { faceSideImg, backSideImg } = props.material
  return !!faceSideImg.original || !!backSideImg.original
})

const haveQuota = computed(() => {
  const { max, used } = store.getters['polling/plan'].quota.u3m
  return max - used > 0
})

const hasNotCreatedU3M = computed(() =>
  [INITIAL, UNQUALIFIED].includes(props.material.u3m.status)
)

const handleCreateU3m = () => {
  create3DMaterial.func(props.material)
}

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

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
  })
}

const actionButton = computed(() => {
  const status = props.material.u3m.status
  let text, clickHandler
  let buttonType = 'primary'

  if (status === COMPLETED) {
    text = t('UU0006')
    clickHandler = openModalModelEditor
    buttonType = 'secondary'
  } else if (status === UNSUCCESSFUL) {
    text = t('UU0082')
    clickHandler = handleCreateU3m
  } else if (status === UNQUALIFIED || !haveQuota.value) {
    clickHandler = null
    text = t('UU0101')
  } else if ([IN_QUEUE, PROCESSING].includes(status)) {
    clickHandler = null
    text = t('UU0102')
  } else if (status === INITIAL) {
    clickHandler = handleCreateU3m
    text = t('UU0020')
  }

  return { buttonType, text, clickHandler }
})

const label = computed(() => {
  let text
  let color
  switch (props.material.u3m.status) {
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
    case INITIAL:
    case UNQUALIFIED:
      color = null
      text = t('EE0019')
      break
  }

  return { text, color }
})

const requirementList = computed(() => [
  {
    text: t('EE0117'),
    isMeet: hasScannedImage.value,
  },
  {
    text: t('EE0118'),
    isMeet: haveQuota.value,
  },
  {
    text: t('EE0141'),
    isMeet: props.material.isComplete,
  },
])
</script>
