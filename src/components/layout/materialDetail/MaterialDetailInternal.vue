<template lang="pug">
div
  div(class="flex gap-x-10")
    block-material-preview-img(:material="material" class="w-112.5 flex-shrink-0")
    div(class="flex flex-col gap-y-7.5 flex-grow")
      block-material-specification(:material="material")
      block-material-pantone(:pantoneList="material.pantoneList")
      block-material-internal-u3m-status(:material="material")
  tabs(:tabList="tabList" keyField="id" class="pt-20")
    template(#default="{ currentTab }")
      div(class="pt-10")
        template(v-if="currentTab === TAB.TAGS")
          div
            p(class="pb-3 text-body2 font-bold text-primary") {{ $t("RR0027") }}
            div(class="flex flex-wrap gap-x-2 gap-y-3")
              div(v-for="tag in material.publicTagList" class="px-3 h-8 flex items-center bg-primary-thin rounded text-body2 text-primary") {{ tag }}
          div(class="pt-7")
            p(class="pb-3 text-body2 font-bold text-primary") {{ $t("RR0071") }}
            div(class="flex flex-wrap gap-x-2 gap-y-3")
              div(v-for="tag in material.aiTagList" class="px-3 h-8 flex items-center bg-primary-thin rounded text-body2 text-primary") {{ tag }}
          div(class="mt-10 rounded-md bg-black-100 px-5 py-7.5")
            h6(class="text-h6 font-bold text-black-600") {{ $t("EE0026") }}
            div(class="pt-7.5")
              p(class="pb-3 text-body2 font-bold text-primary") {{ $t("RR0028") }}
              div(class="flex flex-wrap gap-x-2 gap-y-3")
                div(v-for="tag in material.privateTagList" class="px-3 h-8 flex items-center bg-primary-thin rounded text-body2 text-primary") {{ tag }}
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
          div(class="flex flex-wrap gap-5")
            attachment-item(
              v-for="(attachment, index) in attachmentSortedList"
              :attachmentList="attachmentSortedList"
              :attachment="attachment"
              :index="index"
              isReadOnly
            )
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import useMaterial from '@/composables/useMaterial'
import AttachmentItem from '@/components/assets/material/edit/AttachmentItem.vue'
import BlockMaterialPreviewImg from '@/components/layout/materialDetail/BlockMaterialPreviewImg.vue'
import BlockMaterialPantone from '@/components/layout/materialDetail/BlockMaterialPantone.vue'
import BlockMaterialSpecification from '@/components/layout/materialDetail/BlockMaterialSpecification.vue'
import BlockMaterialInternalU3mStatus from '@/components/layout/materialDetail/BlockMaterialInternalU3mStatus.vue'

const props = defineProps({
  material: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()

const TAB = {
  TAGS: 0,
  PRICING: 1,
  INVENTORY: 2,
  SUP: 3
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
  }
]
const {
  materialInfo,
  materialInventoryInfo,
  materialPublicPriceInfo,
  materialPrivatePriceInfo,
  attachmentSortedList
} = useMaterial(props.material)
</script>
