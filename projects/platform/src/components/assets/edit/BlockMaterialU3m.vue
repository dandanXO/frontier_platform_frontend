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
        f-infobar(
          v-if="showU3mWarning"
          class="w-full"
          :notifyType="NOTIFY_TYPE.WARNING"
          messageText="If you update the content in the required fields, you must first save and create the 3D material in order to display the latest results."
        )
        f-infobar(
          v-if="showU3mRegenerateInfo"
          class="w-full"
          :notifyType="NOTIFY_TYPE.INFO"
          title="Create 3D Material"
          messageText="Re-create to keep the 3D Material up-to-date."
        )
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
          keypath="WW0140"
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
          :mode="CREATE_EDIT.EDIT"
          :status="material.customU3m.status"
        )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useField } from 'vee-validate'
import { z } from 'zod'
import { MaterialU3mStatus, type Material } from '@frontier/platform-web-sdk'
import MaterialU3mViewerButton from '@/components/common/material/u3m/MaterialU3mViewerButton.vue'
import MaterialU3mStatusBlock from '@/components/common/material/u3m/MaterialU3mStatusBlock.vue'
import BlockMaterialUploadU3m from '@/components/assets/edit/BlockMaterialUploadU3m.vue'
import { CREATE_EDIT } from '@/utils/constants'
import u3mInstructionImage from '@/assets/images/u3m.png'
import useAssets from '@/composables/useAssets'
import useMaterial from '@/composables/material/useMaterial'
import useMaterialSchema, {
  materialSideSchema,
} from '@/composables/material/useMaterialSchema'
import { NOTIFY_TYPE } from '@/utils/constants'

const props = defineProps<{
  material: Material
}>()

const { meta: itemNoMeta } = useField('itemNo')

const { meta: faceSideMaterialTypeMeta } = useField('faceSide.materialType')
const { meta: faceSideWarpDensityMeta } = useField(
  'faceSide.construction.warpDensity'
)
const { meta: faceSideWeftDensityMeta } = useField(
  'faceSide.construction.weftDensity'
)
const { meta: faceSideWarpYarnSizeMeta } = useField('faceSide.warpYarnSize')
const { meta: faceSideWeftYarnSizeMeta } = useField('faceSide.weftYarnSize')
const { meta: faceSideContentListMeta } = useField('faceSide.contentList')

const { meta: backSideMaterialTypeMeta } = useField('backSide.materialType')
const { meta: backSideWarpDensityMeta } = useField(
  'backSide.construction.warpDensity'
)
const { meta: backSideWeftDensityMeta } = useField(
  'backSide.construction.weftDensity'
)
const { meta: backSideWarpYarnSizeMeta } = useField('backSide.warpYarnSize')
const { meta: backSideWeftYarnSizeMeta } = useField('backSide.weftYarnSize')
const { meta: backSideContentListMeta } = useField('backSide.contentList')

const { meta: widthMeta } = useField('width')
const { meta: weightMeta } = useField('weight')

const showU3mWarning = computed(() => {
  return (
    [INITIAL, COMPLETED].includes(props.material.u3m.status) &&
    (itemNoMeta.dirty ||
      widthMeta.dirty ||
      weightMeta.dirty ||
      faceSideMaterialTypeMeta.dirty ||
      faceSideWarpDensityMeta.dirty ||
      faceSideWeftDensityMeta.dirty ||
      faceSideWarpYarnSizeMeta.dirty ||
      faceSideWeftYarnSizeMeta.dirty ||
      faceSideContentListMeta.dirty ||
      backSideMaterialTypeMeta.dirty ||
      backSideWarpDensityMeta.dirty ||
      backSideWeftDensityMeta.dirty ||
      backSideWarpYarnSizeMeta.dirty ||
      backSideWeftYarnSizeMeta.dirty ||
      backSideContentListMeta.dirty)
  )
})

const showU3mRegenerateInfo = computed(() => {
  return props.material.u3m.isNotifyReCreate
})

const { UNQUALIFIED, INITIAL, COMPLETED, UNSUCCESSFUL } = MaterialU3mStatus

const { t } = useI18n()
const store = useStore()

const material = computed(() => props.material)
const { hasScannedImage } = useMaterial(material)
const materialSchema = useMaterialSchema()
const { createU3m } = useAssets()

const hasU3mQuota = computed<boolean>(
  () => store.getters['polling/hasU3mQuota']
)
const hasFilledRequiredFields = computed(() => {
  const u3mRequiredMaterialSchema = z.object({
    itemNo: materialSchema.shape.itemNo,
    width: materialSchema.shape.width,
    weight: materialSchema.shape.weight,
    faceSide: materialSideSchema
      .pick({ contentList: true, materialType: true })
      .nullable(),
    backSide: materialSideSchema
      .pick({ contentList: true, materialType: true })
      .nullable(),
  })

  const result = u3mRequiredMaterialSchema.safeParse(material.value)
  return result.success
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

const handleCreateU3m = () => {
  createU3m.func(props.material)
}

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
  })
}
</script>
