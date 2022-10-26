<template lang="pug">
div
  div(class="flex gap-x-10")
    material-detail-preview-img(:material="material" class="w-112.5 flex-shrink-0")
    div(class="flex flex-col gap-y-7.5 flex-grow")
      material-detail-specification(:material="material")
      material-detail-pantone(:pantoneList="material.pantoneList")
      material-detail-external-u3m-status(
        :isEmbed="isEmbed"
        :material="material"
        :isCanDownloadU3M="isCanDownloadU3M"
      )
  div(class="pt-16 grid gap-y-7.5")
    div
      h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('RR0133') }}
      div(class="flex flex-wrap gap-x-2 gap-y-3")
        f-label(
          v-for="tag in [...material.publicTagList, ...material.aiTagList]"
        ) {{ tag }}
    div
      h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('RR0043') }}
      div(class="grid gap-y-2")
        p(
          v-for="item in materialPublicPriceInfo"
          class="text-body2 text-grey-900 line-clamp-1"
        ) {{ item.name }}: {{ item.value }}
    div(v-if="material.isPublicInventory")
      h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('RR0135') }}
      p(class="text-body2 text-grey-900 line-clamp-1") {{ materialInfo.totalInventoryQty.name }}: {{ materialInfo.totalInventoryQty.value }}
    div
      h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('RR0136') }}
      div(class="grid gap-y-7.5")
        div
          p(class="pb-3 text-body2 font-bold text-grey-900") {{ $t('EE0129') }}
          div(class="flex flex-wrap gap-x-2 gap-y-3")
            f-label(v-for="tag in material.certificateList") {{ tag.name }}
        div
          p(class="pb-3 text-body2 font-bold text-grey-900") {{ $t('EE0130') }}
          div(v-if="attachmentSortedList.length > 0" class="flex flex-wrap gap-5")
            attachment-item(
              v-for="(attachment, index) in attachmentSortedList"
              :attachmentList="attachmentSortedList"
              :attachment="attachment"
              :index="index"
              isReadOnly
            )
    div
      div(class="flex items-center pb-5")
        f-svg-icon(iconName="subscribe" size="20" class="text-grey-900 mr-2")
        h5(class="text-h5 font-bold text-grey-900") {{ $t('RR0219') }}
      material-detail-environmental-indicator(:material="material")
</template>

<script setup>
import useMaterial from '@/composables/useMaterial'
import AttachmentItem from '@/components/common/material/attachment/AttachmentItem.vue'
import MaterialDetailPreviewImg from '@/components/common/material/detail/MaterialDetailPreviewImg.vue'
import MaterialDetailPantone from '@/components/common/material/detail/MaterialDetailPantone.vue'
import MaterialDetailSpecification from '@/components/common/material/detail/MaterialDetailSpecification.vue'
import MaterialDetailExternalU3mStatus from '@/components/common/material/detail/MaterialDetailExternalU3mStatus.vue'
import MaterialDetailEnvironmentalIndicator from '@/components/common/material/detail/MaterialDetailEnvironmentalIndicator.vue'

const props = defineProps({
  isEmbed: {
    type: Boolean,
    required: false,
  },
  material: {
    type: Object,
    required: true,
  },
  isCanDownloadU3M: {
    type: Boolean,
    required: true,
  },
})

const { materialInfo, materialPublicPriceInfo, attachmentSortedList } =
  useMaterial(props.material)
</script>
