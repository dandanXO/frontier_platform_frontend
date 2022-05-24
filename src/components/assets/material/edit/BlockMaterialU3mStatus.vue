<template lang="pug">
div
  div(class="flex items-center mb-6 text-primary")
    h5(class="text-h5 font-bold") {{ $t('RR0132') }}
    tooltip(placement="top" class="pl-1" :manual="true")
      template(#trigger)
        svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
      template(#content)
        div(class="p-5")
          span(class="text-body2 text-assist-blue underline leading-1.6 cursor-pointer" @click="openModalU3mInstruction") {{ $t("UU0029") }}
  p(class="text-caption text-black-800 font-bold leading-1.6 mb-1") {{ $t("EE0017") }}
    svg-icon(v-if="material.u3m.status === IN_QUEUE || material.u3m.status === PROCESSING" iconName="loading" size="16" class="text-brand inline-block ml-2")
  div(v-if="material.u3m.status === INITIAL || material.u3m.status === UNQUALIFIED" class="flex items-center bg-black-50 w-fit px-3.5 h-8.5 rounded mb-6")
    p(class="text-body2 text-primary") {{ $t('EE0019') }}     
  div(v-else class="flex items-center bg-black-50 w-fit px-3.5 h-8.5 rounded mb-6" @click="goToProgress('u3m')")
    div(class="w-3 h-3 rounded-sm mr-2.5" :class="[label.color]")
    p(class="text-body2 text-primary") {{ label.text }}
  div(class="flex flex-nowrap flex-grow")
    div(class="flex-shrink-0")
      btn(v-if="material.u3m.status === COMPLETED" size="md" type="secondary" @click="handleCreateU3m") {{ $t("UU0006") }}
      btn(
        v-else-if="material.u3m.status === UNSUCCESSFUL"
        size="md"
        @click="handleCreateU3m"
      ) {{ $t('UU0082') }}
      btn(
        v-else-if="material.u3m.status === INITIAL && haveQuota" 
        size="md"
        @click="handleCreateU3m"
      ) {{ $t('UU0020') }}
      btn(
        v-else-if="material.u3m.status === UNQUALIFIED || !haveQuota" 
        size="md"
        disabled
      ) {{ $t('UU0101') }}
      btn(
        v-else-if="material.u3m.status === IN_QUEUE || material.u3m.status === PROCESSING" 
        size="md"
        disabled
      ) {{ $t('UU0102') }}
    div(v-if="material.u3m.status === COMPLETED" class="flex text-body2 text-assist-blue gap-2 ml-4")
      span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(material.u3m.zipUrl)") {{ $t("EE0081") }}
        svg-icon(iconName="u3m_download" size="20")
      span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(material.u3m.u3maUrl)") {{ $t("EE0082") }}
        svg-icon(iconName="u3m_download" size="20")
  div(v-if="material.u3m.status === COMPLETED" class="text-primary flex items-center cursor-pointer mt-5.5" @click="handleCreateU3m")
    svg-icon(iconName="rotate_right" size="20")
    p(class="text-body2 ml-1") {{ $t("UU0030") }}
  i18n-t(v-else-if="material.u3m.status === UNSUCCESSFUL" keypath="EE0119" tag="p" class="leading-1.6 mt-2 text-caption text-warn-middle")
    template(#newline)
      br
    template(#EE0120)
      span(class="text-assist-blue ml-0.5 cursor-pointer" @click="handleCreateU3m") {{ $t("EE0120") }}
    template(#RR0123)
      span(class="text-assist-blue ml-0.5 cursor-pointer" @click="openModalSendFeedback") {{ $t("RR0123") }}
  div(v-else-if="material.u3m.status === INITIAL || material.u3m.status === UNQUALIFIED" class="grid gap-0.5 mt-2")
    div(class="flex items-center" :class="[haveScannedImage ? 'text-brand' : 'text-black-500']")
      svg-icon(v-if="haveScannedImage" iconName="done" size="16")
      svg-icon(v-else iconName="clear" size="16")
      p(class="text-caption ml-1.5 leading-1.6") {{ $t("EE0117") }}
    div(class="flex items-center" :class="[haveQuota ? 'text-brand' : 'text-black-500']")
      svg-icon(v-if="haveQuota" iconName="done" size="16")
      svg-icon(v-else iconName="clear" size="16")
      p(class="text-caption ml-1.5 leading-1.6") {{ $t("EE0118") }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { U3M_STATUS } from '@/utils/constants'
import useAssets from '@/composables/useAssets'
import { downloadDataURLFile } from '@/utils/fileOperator'
import useNavigation from '@/composables/useNavigation'

const props = defineProps({
  material: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()
const store = useStore()
const { create3DMaterial } = useAssets()
const { goToProgress } = useNavigation()
const { UNQUALIFIED, INITIAL, IN_QUEUE, COMPLETED, PROCESSING, UNSUCCESSFUL } = U3M_STATUS

const haveScannedImage = computed(() => {
  const { faceSideImg, backSideImg } = props.material
  return faceSideImg.original || backSideImg.original
})

const haveQuota = computed(() => {
  const { max, used } = store.getters['polling/plan'].quota.u3m
  return max - used > 0
})

const downloadU3m = async (url) => {
  const fileName = url.split('/')[url.split('/').length - 1]
  downloadDataURLFile(url, fileName)
}

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
      }
    }
  })
}

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback'
  })
}

const label = computed(() => {
  let text
  let color
  switch (props.material.u3m.status) {
    case IN_QUEUE:
      text = t('PP0004')
      color = 'bg-assist-light-blue'
      break
    case COMPLETED:
      text = t('PP0006')
      color = 'bg-brand'
      break
    case PROCESSING:
      text = t('PP0005')
      color = 'bg-assist-light-yellow'
      break
    case UNSUCCESSFUL:
      text = t('PP0007')
      color = 'bg-warn-middle'
      break
  }

  return { text, color }
})
</script>
