<template lang="pug">
div
  div(class="flex gap-x-10")
    block-material-previewImg(:material="material")
    div(class="flex flex-col gap-y-7.5")
      block-material-specification(:material="material")
      block-material-pantone(:pantoneList="material.pantoneList")
      //- Inventory
      div
        h5(class="text-h5 font-bold text-primary pb-3") {{$t('RR0135')}}
        p(class='text-body2 text-primary line-clamp-1') {{materialInfo.totalInventoryQty.name}}: {{materialInfo.totalInventoryQty.value}}
      //- Pricing
      div
        h5(class="text-h5 font-bold text-primary pb-3") {{$t('RR0043')}}
        div(class="grid gap-y-2")
          p(v-for='item in materialPublicPriceInfo' class='text-body2 text-primary line-clamp-1') {{item.name}}: {{item.value}}
      //- U3m
      block-material-u3m-status
  div(class="pt-5 grid gap-y-10")
    div
      h5(class="text-h5 font-bold text-primary pb-7.5") {{$t('RR0133')}}
      div(class="flex flex-wrap gap-x-2 gap-y-3")
        div(v-for="tag in [...material.publicTagList, ...material.aiTagList]" class="px-3 h-8 flex items-center bg-primary-thin rounded text-body2 text-primary") {{tag}}
    div
      h5(class="text-h5 font-bold text-primary pb-7.5") {{$t('RR0136')}}
      div(class="flex flex-wrap gap-5")
        attachment-item(v-for="attachment in attachmentSortedList" :attachment="attachment" :isReadOnly="true")
</template>

<script>
import useMaterial from '@/composables/useMaterial'
import AttachmentItem from '@/components/assets/material/edit/AttachmentItem'
import BlockMaterialPreviewImg from '@/components/layout/materialDetail/BlockMaterialPreviewImg.vue'
import BlockMaterialPantone from '@/components/layout/materialDetail/BlockMaterialPantone.vue'
import BlockMaterialSpecification from '@/components/layout/materialDetail/BlockMaterialSpecification.vue'
import BlockMaterialU3mStatus from '@/components/layout/materialDetail/BlockMaterialU3mStatus.vue'

export default {
  name: 'MaterialDetailExternal',
  components: {
    AttachmentItem,
    BlockMaterialPreviewImg,
    BlockMaterialSpecification,
    BlockMaterialPantone,
    BlockMaterialU3mStatus
  },
  props: {
    material: {
      type: Object,
      required: true
    }
  },
  async setup (props) {
    const {
      materialInfo,
      materialBasicInfo,
      materialInventoryInfo,
      materialPublicPriceInfo,
      materialPrivatePriceInfo,
      attachmentSortedList
    } = useMaterial(props.material)

    return {
      attachmentSortedList,
      materialInfo,
      materialBasicInfo,
      materialInventoryInfo,
      materialPublicPriceInfo,
      materialPrivatePriceInfo
    }
  }
}
</script>
