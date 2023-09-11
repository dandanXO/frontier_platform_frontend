<template lang="pug">
div(class="grid gap-x-14 grid-cols-2")
  div(class="min-w-75 max-w-115")
    div(class="flex justify-between pb-2 border-grey-250 border-b mb-3")
      div(class="text-body1 font-bold text-grey-900") {{ $t('RR0130') }}
      f-button-label(@click="openModalMaterialEditSimple('spec')") {{ $t('UU0027') }}
    div(class="grid gap-3")
      p(
        v-for="(item, key) in materialBasicInfo"
        class="text-body2 line-clamp-1 !break-all"
        :class="{ 'text-grey-600': key === 'frontierNo' }"
      ) {{ item.name }}: {{ item.value }}
  div(class="flex flex-col gap-y-7 min-w-75 max-w-115")
    div
      div(class="flex justify-between pb-2 border-grey-250 border-b mb-3")
        div(class="text-body1 font-bold text-grey-900") {{ $t('RR0135') }}
        f-button-label(@click="openModalMaterialEditSimple('inventory')") {{ $t('UU0027') }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.totalInventoryQty.name }}: {{ materialInfo.totalInventoryQty.value }}
    div
      div(class="flex justify-between pb-2 border-grey-250 border-b mb-3")
        div(class="text-body1 font-bold text-grey-900") {{ $t('RR0134') }}
        f-button-label(@click="openModalMaterialEditSimple('public-price')") {{ $t('UU0027') }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.publicPrice.pricing.name }}: {{ materialInfo.publicPrice.pricing.value }}
    div
      div(class="flex justify-between pb-2 border-grey-250 border-b mb-3")
        div(class="text-body1 font-bold text-grey-900") {{ $t('RR0133') }}
        f-button-label(@click="openModalMaterialEditSimple('tag')") {{ $t('UU0027') }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0027') }}: {{ material.publicTagList.join(',') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0071') }}: {{ material.aiTagList.join(',') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0028') }}: {{ material.privateTagList.join(',') }}
    div
      div(class="flex justify-between items-end pb-2 border-grey-250 border-b")
        div(
          class="text-body1 font-bold"
          :class="[made2flowSubscribed ? 'text-grey-900' : 'text-grey-250']"
        ) {{ $t('RR0219') }}
        div(class="p-1 hover:bg-grey-100 hover:rounded cursor-pointer")
          f-svg-icon(
            iconName="info_outline"
            size="14"
            class="text-grey-600 cursor-pointer"
            @click="openModalIndicatorMethodology"
          )
      div(v-if="made2flowSubscribed" class="flex items-center gap-x-1 pt-3")
        div(
          v-for="property in carbonEmissionInfo"
          class="min-w-19.5 flex items-center gap-x-1"
        )
          f-svg-icon(
            :iconName="property.icon"
            size="20"
            :class="[property.differenceInPercent > 0 ? 'text-primary-400' : 'text-grey-900']"
          )
          p(v-if="property.personalized" class="text-body2 text-grey-900") {{ property.personalized }} {{ property.unitShort }}
          hr(v-else class="w-4 border-grey-250")
      div(
        v-else
        class="bg-no-repeat"
        :style="{ backgroundImage: `url(${listViewMask})` }"
      )
        f-infobar(
          :messageText="$t('VV0048')"
          :action="{ text: $t('UU0116'), handler: viewTheProgram }"
          :hasContainer="false"
          :display="DISPLAY.BLOCK"
        )
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useMaterialOld from '@/composables/useMaterialOld'
import listViewMask from '@/assets/images/list_view_mask.png'
import { VALUE_ADDED_SERVICE_ID, DISPLAY } from '@/utils/constants'

const props = defineProps({
  material: {
    type: Object,
  },
})
const store = useStore()
const router = useRouter()
const { materialBasicInfo, materialInfo, carbonEmissionInfo } = useMaterialOld(
  props.material
)

const made2flowSubscribed = computed(
  () => store.getters['polling/valueAddedService'].made2flow.planStatus.ACTIVATE
)

const openModalMaterialEditSimple = async (type) => {
  store.dispatch(
    'assets/setMaterial',
    JSON.parse(JSON.stringify(props.material))
  )
  store.dispatch('helper/openModalBehavior', {
    component: `modal-material-edit-simple-${type}`,
  })
}

const openModalIndicatorMethodology = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-indicator-methodology',
  })
}

const viewTheProgram = () => {
  router.push({
    name: 'Billings',
    params: { tab: 'value-added-service' },
    query: { service: VALUE_ADDED_SERVICE_ID.MADE2FLOW },
  })
}
</script>
