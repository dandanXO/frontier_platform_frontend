<template lang="pug">
modal-behavior(
  :header="$t('QQ0085', { materialNo: material.itemNo })"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  div(class="w-[min(992px,calc(100vw_-_80px_-_40px))] flex justify-between px-10")
    material-detail-external-image(
      :material="material"
      class="w-[54%] h-fit sticky top-5"
    )
    div(class="w-[43%] mb-24")
      div(class="mb-6")
        //- Org Logo & Name
        div(class="flex items-center gap-x-2 mb-2")
          f-avatar(type="org" size="lg" :imageUrl="material.metaData.unitLogo")
          p(class="text-body2 text-grey-900") {{ material.metaData.unitName }}
        //- Item No & Pin
        h4(class="text-h4 text-grey-900 font-bold") {{ material.itemNo }}
      //- Material Info
      material-detail-info(
        :material="material"
        :publishedDate="undefined"
        :isCanDownloadU3M="false"
        :drawerOpenFromLocationList="[]"
      )
</template>

<script setup lang="ts">
import type { Material } from '@frontier/platform-web-sdk'
import MaterialDetailExternalImage from '@/components/common/material/detail/external/MaterialDetailExternalImage.vue'
import MaterialDetailInfo from '@/components/common/material/detail/external/MaterialDetailInfo.vue'

export interface PropsModalStickerMaterialDetail {
  material: Material
}
defineProps<PropsModalStickerMaterialDetail>()
</script>
