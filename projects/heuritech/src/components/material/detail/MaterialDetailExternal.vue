<template lang="pug">
div
  div(class="flex gap-x-10")
    material-detail-preview-img(:material="material" class="w-125 flex-shrink-0")
    div(class="flex flex-col gap-y-3 flex-grow")
      div(class="pb-2")
        h5(class="text-h5 text-grey-900 font-bold leading-1.6") {{ material.materialNo }}
        div(class="flex items-center gap-x-2")
          f-avatar(type="org" :imageUrl="material.unitLogo" size="md")
          p(class="text-body2 text-grey-900 font-bold leading-1.6 break-words") {{ material.unitName }}
      material-detail-specification(:material="material")
      material-detail-pantone(:pantoneList="material.pantoneList")
      material-detail-u3m(
        class="max-w-80"
        :materialId="material.materialId"
        :u3m="material.u3m"
        :customU3m="material.customU3m"
        :showStatusBlock="false"
        :downloadHandler="downloadU3m"
      )
  div(class="pt-10 grid gap-y-7.5")
    div(class="grid grid-cols-3 divide-x divide-grey-200")
      div
        h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('RR0043') }}
        div(class="grid gap-y-2")
          p(
            v-for="item in materialPublicPriceInfo"
            :key="item.name"
            class="text-body2 text-grey-900 line-clamp-1"
          ) {{ item.name }}: {{ item.value }}
      div(v-if="material.isPublicInventory" class="px-3")
        h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('RR0135') }}
        p(class="text-body2 text-grey-900 line-clamp-1") {{ materialInfo.totalInventoryQty.name }}: {{ materialInfo.totalInventoryQty.value }}
      div(class="px-3")
        h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('RR0133') }}
        div(class="flex flex-wrap gap-x-2 gap-y-3")
          f-tag(
            v-for="tag in [...material.publicTagList, ...material.aiTagList]"
            :key="tag"
          ) {{ tag }}
    div(v-if="material.certificateList.length > 0")
      h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('EE0129') }}
      div(class="flex flex-wrap gap-x-2 gap-y-3")
        f-tag(v-for="tag in material.certificateList" :key="tag") {{ tag.name }}
    div(v-if="attachmentSortedList.length > 0")
      h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('EE0130') }}
      div(class="flex flex-wrap gap-5")
        attachment-item(
          v-for="(attachment, index) in attachmentSortedList"
          :key="`attachment-${index}`"
          :attachmentList="attachmentSortedList"
          :attachment="attachment"
          :index="index"
          isReadOnly
        )
</template>

<script setup>
import useMaterialOld from '@/composables/useMaterialOld'
import AttachmentItem from '@/components/material/attachment/AttachmentItem.vue'
import MaterialDetailPreviewImg from '@/components/material/detail/MaterialDetailPreviewImg.vue'
import MaterialDetailPantone from '@/components/material/detail/MaterialDetailPantone.vue'
import MaterialDetailSpecification from '@/components/material/detail/MaterialDetailSpecification.vue'
import MaterialDetailU3m from '@/components/material/detail/MaterialDetailU3m.vue'
import { downloadDataURLFile } from '@frontier/lib'
import { useModalStore } from '@/stores/modal'
import { useI18n } from 'vue-i18n'
import { NOTIFY_TYPE } from '@/utils/constants'

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

const { t } = useI18n()
const modalStore = useModalStore()

const { materialInfo, materialPublicPriceInfo, attachmentSortedList } =
  useMaterialOld(props.material)

const downloadU3m = async ({ url }) => {
  if (!props.isCanDownloadU3M) {
    modalStore.openModalConfirm({
      type: NOTIFY_TYPE.WARNING,
      header: t('II0003'),
      contentText: t('II0004'),
      primaryBtnText: t('UU0031'),
    })
  } else {
    const fileName = url.split('/')[url.split('/').length - 1]
    downloadDataURLFile(url, fileName)
  }
}
</script>
