<template lang="pug">
div(class="w-79")
  div(class="flex items-center mb-6 text-grey-900")
    h5(class="text-h5 font-bold") {{ $t('RR0132') }}
    f-tooltip-media(
      placement="bottom"
      class="pl-1"
      :tooltipTitle="$t('UU0029')"
      :tooltipMessage="$t('EE0066')"
      :imageUrl="u3mInstructionImage"
    )
      template(#slot:tooltip-trigger)
        f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
  f-expansion-panel(class="border-t border-grey-250")
    template(#trigger="{ isExpand }")
      div(class="h-15 flex items-center justify-between")
        p(class="text-body2 text-grey-800 font-bold") {{ $t('EE0174') }}
        f-svg-icon(
          iconName="keyboard_arrow_right"
          size="20"
          class="transform text-grey-900"
          :class="[isExpand ? '-rotate-90' : 'rotate-90']"
        )
    template(#content)
      div(class="-mt-2.5 mb-5 flex flex-col gap-y-2.5")
        div(class="flex items-center gap-x-2")
          material-u3m-viewer-button(
            :materialId="material.materialId"
            :u3m="material.u3m"
          )
          material-u3m-download-button(
            :materialId="material.materialId"
            :u3m="material.u3m"
          )
        material-u3m-status-block(:u3m="material.u3m")
          template(
            v-if="[INITIAL, UNQUALIFIED].includes(material.u3m.status)"
            #slot:append-item
          )
            div(class="flex items-center gap-x-2")
              p(class="w-18 text-caption text-grey-600") {{ $t('PP0010') }}
              div(class="grid gap-0.5 mt-2")
                div(
                  v-for="requirement in requirementList"
                  :key="requirement.text"
                  class="flex items-center"
                  :class="[requirement.isMeet ? 'text-primary-400' : 'text-grey-250']"
                )
                  f-svg-icon(
                    :iconName="requirement.isMeet ? 'done' : 'clear'"
                    size="16"
                  )
                  p(class="text-caption ml-1.5 leading-1.6") {{ requirement.text }}
        f-button(
          v-if="material.u3m.status === INITIAL"
          size="md"
          class="self-end"
          @click="handleCreateU3m"
        ) {{ $t('RR0278') }}
        f-button(
          v-if="material.u3m.status === UNSUCCESSFUL"
          size="md"
          class="self-end"
          @click="handleCreateU3m"
        ) {{ $t('UU0082') }}
        f-button(
          v-if="material.u3m.status === COMPLETED"
          size="md"
          type="text"
          class="self-end"
          prependIcon="rotate_right"
          @click="handleCreateU3m"
        ) {{ $t('UU0030') }}
  f-expansion-panel(class="border-t border-grey-250")
    template(#trigger="{ isExpand }")
      div(class="h-15 flex items-center justify-between")
        div(class="flex items-center gap-x-1")
          p(class="text-body2 text-grey-800 font-bold") {{ $t('EE0175') }}
          f-tooltip-standard(:tooltipMessage="$t('EE0166')")
            template(#slot:tooltip-trigger)
              f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
        f-svg-icon(
          iconName="keyboard_arrow_right"
          size="20"
          class="transform text-grey-900"
          :class="[isExpand ? '-rotate-90' : 'rotate-90']"
        )
    template(#content)
      div(class="-mt-2.5 flex flex-col gap-y-2.5")
        div(class="flex items-center gap-x-2")
          material-u3m-viewer-button(
            :materialId="material.materialId"
            :u3m="material.customU3m"
          )
          material-u3m-download-button(
            :materialId="material.materialId"
            :u3m="material.customU3m"
          )
        material-u3m-status-block(:u3m="material.customU3m")
          template(
            v-if="material.customU3m.status === COMPLETED"
            #slot:prepend-item
          )
            div(class="flex items-center gap-x-2")
              p(class="w-18 text-caption text-grey-600") {{ $t('DD0057') }}
              div(class="flex items-center gap-x-2")
                div(class="bg-grey-150 flex items-center justify-center p-1 rounded")
                  f-svg-icon(iconName="file" size="16" class="text-grey-600")
                p(class="text-body2/1.6 text-grey-800 line-clamp-1") {{ material.customU3m.customFileName }}
        i18n-t(
          v-if="material.customU3m.status === UNSUCCESSFUL"
          keypath="PP0014"
          tag="p"
          scope="global"
          class="text-red-400 text-caption/1.6"
        )
          template(#RR0123)
            span(
              class="text-cyan-400 ml-0.5 cursor-pointer"
              @click="openModalSendFeedback"
            ) {{ $t('RR0123') }}
        block-material-upload-u3m(
          ref="refBlockMaterialUploadU3m"
          :mode="CREATE_EDIT.EDIT"
          :status="material.customU3m.status"
        )
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import MaterialU3mDownloadButton from '@/components/common/material/u3m/MaterialU3mDownloadButton.vue'
import MaterialU3mViewerButton from '@/components/common/material/u3m/MaterialU3mViewerButton.vue'
import MaterialU3mStatusBlock from '@/components/common/material/u3m/MaterialU3mStatusBlock.vue'
import BlockMaterialUploadU3m from '@/components/assets/edit/BlockMaterialUploadU3m.vue'
import useAssets from '@/composables/useAssets'
import { U3M_STATUS, CREATE_EDIT } from '@/utils/constants'
import u3mInstructionImage from '@/assets/images/u3m.png'
import { inputValidator } from '@frontier/lib'
import type { Material } from '@frontier/platform-web-sdk'
import type { MakePropertiesRequired } from '@/types'

const props = defineProps<{
  material: MakePropertiesRequired<
    Material,
    'materialId' | 'u3m' | 'customU3m' | 'faceSideImg' | 'backSideImg'
  >
}>()

const { UNQUALIFIED, INITIAL, COMPLETED, UNSUCCESSFUL } = U3M_STATUS

const material = computed(() => props.material)

const { t } = useI18n()
const store = useStore()
const { create3DMaterial } = useAssets()

const refBlockMaterialUploadU3m =
  ref<InstanceType<typeof BlockMaterialUploadU3m>>()

defineExpose({
  hasUploadedU3mFile: computed(
    () => refBlockMaterialUploadU3m.value?.hasUploadedU3mFile
  ),
  u3mFile: computed(() => refBlockMaterialUploadU3m.value?.u3mFile),
  needToGeneratePhysical: computed(
    () => refBlockMaterialUploadU3m.value?.needToGeneratePhysical
  ),
})

const handleCreateU3m = () => {
  create3DMaterial.func(props.material)
}

const hasScannedImage = computed<boolean>(() => {
  const { faceSideImg, backSideImg } = props.material
  return !!faceSideImg.original || !!backSideImg.original
})
const hasU3mQuota = computed<boolean>(
  () => store.getters['polling/hasU3mQuota']
)
const hasFilledRequiredFields = computed<boolean>(() => {
  const { required, maxIntegerDecimal } = inputValidator
  const { materialNo, width, weight, contentList } = material.value

  if (!contentList || contentList?.length === 0) {
    return false
  }

  if (
    new Set(contentList.map(({ name }) => name)).size !== contentList.length
  ) {
    return false
  }

  let total = 0
  for (let i = 0; i < contentList.length; i++) {
    const { name, percentage } = contentList[i]

    if (!required(name)) {
      return false
    }

    if (!maxIntegerDecimal(3, 2, percentage)) {
      return false
    }

    total += Number(percentage)
  }
  if (Number(total.toFixed(3)) !== 100) {
    return false
  }

  return required(materialNo) && required(width) && required(weight)
})
const requirementList = computed(() => [
  {
    text: t('EE0117'),
    isMeet: hasScannedImage.value,
  },
  {
    text: t('EE0118'),
    isMeet: hasU3mQuota.value,
  },
  {
    text: t('EE0141'),
    isMeet: hasFilledRequiredFields.value,
  },
])

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
  })
}
</script>
