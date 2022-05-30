<template lang="pug">
div
  div(class="flex gap-x-10")
    material-detail-preview-img(:material="material" class="w-112.5 flex-shrink-0")
    div(class="flex flex-col gap-y-7.5 flex-grow")
      material-detail-specification(:material="material")
      material-detail-pantone(:pantoneList="material.pantoneList")
      material-detail-internal-u3m-status(:material="material")
  tabs(:tabList="tabList" keyField="id" class="pt-20")
    template(#default="{ currentTab }")
      div(class="pt-10")
        template(v-if="currentTab === TAB.TAGS")
          div
            p(class="pb-3 text-body2 font-bold text-primary") {{ $t("RR0027") }}
            div(class="flex flex-wrap gap-x-2 gap-y-3")
              tag(v-for="tag in material.publicTagList") {{ tag }}
          div(class="pt-7 pb-10")
            p(class="pb-3 text-body2 font-bold text-primary") {{ $t("RR0071") }}
            div(class="flex flex-wrap gap-x-2 gap-y-3")
              tag(v-for="tag in material.aiTagList") {{ tag }}
          div(class="rounded-md bg-black-100 px-5 py-7.5")
            h6(class="text-h6 font-bold text-black-600") {{ $t("EE0026") }}
            div(class="pt-7.5")
              p(class="pb-3 text-body2 font-bold text-primary") {{ $t("RR0028") }}
              div(class="flex flex-wrap gap-x-2 gap-y-3")
                tag(v-for="tag in material.privateTagList") {{ tag }}
        template(v-else-if="currentTab === TAB.PRICING")
          div(class="grid gap-y-5")
            div(v-for="item in materialPublicPriceInfo" class="text-body2 text-primary grid grid-cols-8")
              p(class="col-span-3") {{ item.name }}
              p(class="col-span-5") {{ item.value }}
          div(class="mt-10 rounded-md bg-black-100 p-7.5")
            h6(class="text-h6 font-bold text-black-600") {{ $t("EE0026") }}
            div(class="pt-7.5")
              div(class="grid gap-y-5")
                div(v-for="item in materialPrivatePriceInfo" class="text-body2 text-primary grid grid-cols-8")
                  p(class="col-span-3") {{ item.name }}
                  p(class="col-span-5") {{ item.value }}
        template(v-else-if="currentTab === TAB.INVENTORY")
          div(class="rounded-md bg-black-100 p-7.5 flex flex-col gap-y-17.5")
            div
              h6(class="text-h6 font-bold text-black-600") {{ $t("EE0026") }}
              div(class="pt-7.5")
                div(class="grid gap-y-5")
                  div(v-for="item in materialInventoryInfo" class="text-body2 text-primary grid grid-cols-8")
                    p(class="col-span-3") {{ item.name }}
                    p(class="col-span-5") {{ item.value }}
            div
              h6(class="text-h6 font-bold text-black-600") {{ $t("EE0027") }}
              div(class="pt-7.5 flex flex-col gap-y-7.5")
                div(class="flex items-center gap-x-11 text-body2 text-primary")
                  p {{ materialInfo.totalInventoryQty.name }}
                  p {{ materialInfo.totalInventoryQty.value }}
                  input-checkbox(
                    v-model:inputValue="material.isPublicInventory"
                    :label="$t('EE0028')"
                    binary
                    size="20"
                    disabled
                  )
                div(class="w-117.5 text-body2 text-primary")
                  div(class="bg-primary-thin w-full h-7.5 grid grid-cols-4 justify-items-center content-center")
                    p {{ $t("RR0035") }}
                    p {{ $t("RR0036") }}
                    p {{ $t("RR0037") }}
                    p {{ $t("RR0038") }}
                  div(class="divide-y divide-solid divide-primary-thin")
                    div(v-for="inventory in material.inventoryList" class="h-10.5 grid grid-cols-4 justify-items-center content-center")
                      p {{ inventory.section }}
                      p {{ inventory.shelf }}
                      p {{ inventory.quantity }}
                      p {{ inventory.unit }}
        template(v-else-if="currentTab === TAB.SUP")
          div(class="pb-10")
            p(class="pb-3 text-body2 font-bold text-primary") {{ $t("EE0129") }}
            div(class="flex flex-wrap gap-x-2 gap-y-3")
              tag(v-for="tag in material.certificateList") {{ tag.name }}
          div
            p(class="pb-3 text-body2 font-bold text-primary") {{ $t("EE0130") }}
            div(v-if="attachmentSortedList.length > 0" class="flex flex-wrap gap-5")
              attachment-item(
                v-for="(attachment, index) in attachmentSortedList"
                :attachmentList="attachmentSortedList"
                :attachment="attachment"
                :index="index"
                isReadOnly
              )
        template(v-else-if="currentTab === TAB.INDICATOR")
          div(class="-mt-10")
            div(
              v-if="!haveScannedImage || !material.isComplete || material.certificateList.length === 0"
              class="h-15 bg-black-50 flex items-center mt-6 pl-4 gap-x-8"
            )
              div(class="flex items-center")
                svg-icon(iconName="info_outline" size="20" class="text-black-600")
                p(v-if="!haveScannedImage || !material.isComplete" class="pl-3 text-black-800 text-caption leading-1.6") {{ $t('EE0126') }}
                p(v-else-if="material.certificateList.length === 0" class="pl-3 text-black-800 text-caption leading-1.6") {{ $t('EE0128') }}
              div(class="flex items-center cursor-pointer" @click="goToAssetMaterialEdit(material)")
                p(class="pr-1.5 text-assist-blue text-caption leading-1.6") {{ $t('EE0127') }}
                svg-icon(iconName="arrow_forward" size="16" class="text-assist-blue")
            material-detail-environmental-indicator(class="mt-3" :material="material")
</template>

<script setup>
import { computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import useMaterial from '@/composables/useMaterial'
import useNavigation from '@/composables/useNavigation'
import AttachmentItem from '@/components/layout/material/attachment/AttachmentItem.vue'
import MaterialDetailPreviewImg from '@/components/layout/material/detail/MaterialDetailPreviewImg.vue'
import MaterialDetailPantone from '@/components/layout/material/detail/MaterialDetailPantone.vue'
import MaterialDetailSpecification from '@/components/layout/material/detail/MaterialDetailSpecification.vue'
import MaterialDetailInternalU3mStatus from '@/components/layout/material/detail/MaterialDetailInternalU3mStatus.vue'
import MaterialDetailEnvironmentalIndicator from '@/components/layout/material/detail/MaterialDetailEnvironmentalIndicator.vue'

const props = defineProps({
  material: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()

const { goToAssetMaterialEdit } = useNavigation()

const TAB = {
  TAGS: 0,
  PRICING: 1,
  INVENTORY: 2,
  SUP: 3,
  INDICATOR: 4
}
const tabList = [
  {
    name: t('RR0133'),
    id: TAB.TAGS
  },
  {
    name: t('RR0134'),
    id: TAB.PRICING
  },
  {
    name: t('RR0135'),
    id: TAB.INVENTORY
  },
  {
    name: t('RR0136'),
    id: TAB.SUP
  },
  {
    name: t('RR0219'),
    id: TAB.INDICATOR
  }
]
const {
  materialInfo,
  materialInventoryInfo,
  materialPublicPriceInfo,
  materialPrivatePriceInfo,
  attachmentSortedList
} = useMaterial(props.material)

const haveScannedImage = computed(() => {
  const { faceSideImg, backSideImg } = props.material
  return faceSideImg.original || backSideImg.original
})
</script>
