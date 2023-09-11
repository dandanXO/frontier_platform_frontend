<template lang="pug">
div(class="flex items-start gap-x-10")
  //- Left Side: Image
  material-detail-image(:displayImageList="displayImageList" class="w-125 shrink-0")
  //- Right Side: Item#, Spec, Color and Pattern, 3D Material
  div
    div(class="pb-6")
      h5(class="text-h5/1.5 font-bold text-grey-900") {{ material.itemNo }}
      div(
        v-if="platformLocationType === PLATFORM_LOCATION_TYPE.INNER_EXTERNAL"
        class="flex items-center gap-x-1"
      )
        f-avatar(type="org" :imageUrl="material.metaData.unitLogo" size="md")
        p(class="text-body2/1.6 text-grey-800 font-bold break-words") {{ material.metaData.unitName }}
    div(class="flex flex-col gap-y-10")
      material-detail-specification(:material="material")
      material-detail-color-and-pattern(:material="material")
      material-detail-u3m(
        :materialId="material.materialId"
        :u3m="material.u3m"
        :customU3m="material.customU3m"
      )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MaterialDetailImage from '@/components/common/material/detail/internal/MaterialDetailImage.vue'
import MaterialDetailSpecification from '@/components/common/material/detail/internal/MaterialDetailSpecification.vue'
import MaterialDetailColorAndPattern from '@/components/common/material/detail/internal/MaterialDetailColorAndPattern.vue'
import MaterialDetailU3m from '@/components/common/material/detail/MaterialDetailU3m.vue'
import useMaterial from '@/composables/material/useMaterial'
import type { Material } from '@frontier/platform-web-sdk'
import { PLATFORM_LOCATION_TYPE } from '@/utils/constants'

const props = defineProps<{
  material: Material
  platformLocationType: PLATFORM_LOCATION_TYPE
}>()

const { displayImageList } = useMaterial(ref(props.material))
</script>
