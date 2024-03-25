<style lang="scss" scoped>
.rwd {
  &-outer-external {
    &-content {
      @apply flex;
      @apply desktop:flex-row flex-col;
      @apply desktop:justify-between;
      @apply desktop:gap-y-0 gap-y-10;
    }
    &-material {
      &-image {
        @apply desktop:w-[57%] w-full;
        @apply desktop:sticky desktop:top-13;
      }
      &-info {
        @apply desktop:w-[40%] w-full;
      }
    }
  }
}
</style>

<template lang="pug">
div(v-if="material" class="w-full mx-auto rwd-outer-external-container")
  div(v-if="!isDesktop" class="mb-6")
    //- Org Name
    p(class="text-body2 text-grey-900 mb-3") {{ material.metaData.unitName }}
    //- Item No
    h4(class="text-h4 text-grey-900 font-bold") {{ material.itemNo }}
  div(class="relative w-full rwd-outer-external-content")
    material-detail-external-image(
      :material="material"
      class="rwd-outer-external-material-image h-fit"
    )
    div(class="rwd-outer-external-material-info pt-13 mb-24")
      div(v-if="isDesktop" class="mb-6")
        //- Org Name
        p(class="text-body2 text-grey-900 mb-3") {{ material.metaData.unitName }}
        //- Item No
        h4(class="text-h4 text-grey-900 font-bold") {{ material.itemNo }}
      //- Material Info
      material-detail-info(:material="material" :isCanDownloadU3M="false")
</template>

<script setup lang="ts">
import MaterialDetailExternalImage from '@/components/common/material/detail/external/MaterialDetailExternalImage.vue'
import MaterialDetailInfo from '@/components/common/material/detail/external/MaterialDetailInfo.vue'
import { computed, watch } from 'vue'
import { useOuterStore } from '@/stores/outer'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useBreakpoints } from '@frontier/lib'

const props = defineProps<{
  frontierNo: string
}>()
const frontierNo = computed(() => String(props.frontierNo))

const { isDesktop } = useBreakpoints()
const userStore = useUserStore()
const outerStore = useOuterStore()
const { material } = storeToRefs(outerStore)

await userStore.checkHasLogin()
watch(material, () => {
  if (!material.value) {
    return
  }
  if (userStore.hasLogin) {
    outerStore.checkIsMaterialOwner(
      material.value.materialId,
      window.history.state.back !== null
    )
  }
})

outerStore.getAssetsExternalMaterial(frontierNo.value)
</script>
