<template lang="pug">
div
  div(class="mx-auto max-w-[1032px] min-w-[665px] h-fit")
    //- Header
    div(class="h-16 flex justify-between items-center")
      //- BreadCrumb
      global-breadcrumb-list(
        :breadcrumbList="locationList"
        @click:item="$event.goTo()"
        fontSize="text-caption"
      )
      //- Function Button
      div(class="flex items-center gap-x-4")
        f-tooltip-standard(:tooltipMessage="$t('RR0056')")
          template(#slot:tooltip-trigger)
            f-svg-icon(
              iconName="content_copy"
              class="text-grey-600 hover:text-primary-400 cursor-pointer"
              size="24"
              @click="$emit('clone')"
            )
        digital-thread-entrance(
          :material="material"
          :drawerOpenFromLocationList="drawerOpenFromLocationList"
        )
    div(class="w-full flex justify-between pt-10 relative")
      material-detail-external-image(
        :material="material"
        class="w-[57%] h-fit sticky top-16"
      )
      div(class="w-[40%] mb-24")
        div(class="mb-6")
          //- Org Logo & Name
          div(class="flex items-center gap-x-2 mb-2")
            f-avatar(type="org" size="lg" :imageUrl="nodeMeta.unitLogo")
            p(class="text-body2 text-grey-900") {{ nodeMeta.unitName }}
          //- Item No
          h4(class="text-h4 text-grey-900 font-bold") {{ material.itemNo }}
        //- Material Info
        material-detail-info(
          :material="material"
          :publishedDate="publishedDate"
          :isCanDownloadU3M="nodeMeta.isCanDownloadU3M"
        )
</template>

<script setup lang="ts">
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import useStickerLocationList from '@/composables/useStickerLocationList'
import MaterialDetailExternalImage from '@/components/common/material/detail/external/MaterialDetailExternalImage.vue'
import MaterialDetailInfo from '@/components/common/material/detail/external/MaterialDetailInfo.vue'
import type { Material, NodeMeta } from '@frontier/platform-web-sdk'

const props = defineProps<{
  material: Material
  nodeMeta: NodeMeta
  locationList: { name: string; goTo: () => void }[]
  publishedDate?: number
}>()

defineEmits<{ (e: 'clone'): void }>()

const drawerOpenFromLocationList = useStickerLocationList(
  props.nodeMeta.locationList.map((b) => b.name)
)
</script>
