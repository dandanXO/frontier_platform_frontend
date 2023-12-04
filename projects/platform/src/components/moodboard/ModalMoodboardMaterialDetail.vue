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
          f-avatar(type="org" size="lg" :imageUrl="nodeMeta.unitLogo")
          p(class="text-body2 text-grey-900") {{ nodeMeta.unitName }}
        //- Item No & Pin
        div(class="flex items-center justify-between")
          h4(class="text-h4 text-grey-900 font-bold") {{ material.itemNo }}
          btn-pick-tooltip(
            :isPicked="moodboardInfo.isPicked"
            @togglePick="moodboardType === MoodboardType.DEMANDER && pickHandler()"
          )
      //- Material Info
      material-detail-info(
        :material="material"
        :publishedDate="nodeMeta.publicDate ?? undefined"
        :isCanDownloadU3M="nodeMeta.isCanDownloadU3M"
      )
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import {
  MoodboardType,
  type MoodboardNodeChild,
  type Material,
} from '@frontier/platform-web-sdk'
import MaterialDetailExternalImage from '@/components/common/material/detail/external/MaterialDetailExternalImage.vue'
import MaterialDetailInfo from '@/components/common/material/detail/external/MaterialDetailInfo.vue'

export interface PropsModalMoodboardMaterialDetail {
  node: MoodboardNodeChild
  moodboardType: MoodboardType
  pickHandler: () => void
}

const props = defineProps<PropsModalMoodboardMaterialDetail>()

const { nodeMeta, moodboardInfo } = toRefs(props.node)
const material = ref(props.node.nodeProperty as Material)
</script>
