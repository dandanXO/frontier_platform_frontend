<template lang="pug">
div(class="grid gap-y-8 content-start")
  //- Price
  div(v-if="material.priceInfo")
    div(v-if="material.priceInfo.pricing" class="flex items-end gap-x-1 mb-5")
      p(class="text-grey-900 font-bold text-body1") $ {{ material.priceInfo.pricing.price }}
      p(class="text-grey-600 text-caption") {{ material.priceInfo.pricing.currencyCode }} / {{ material.priceInfo.pricing.unit }}
      p(v-if="inventoryTotalQtyInYard" class="text-grey-600 text-caption") ({{ inventoryTotalQtyInYard }}Y available)
    div(class="grid gap-y-2")
      template(v-for="item in priceInfo" :key="item")
        div(v-if="item" class="flex text-grey-900 text-body2/1.6")
          p(class="w-[70%] pr-6") {{ item.name }}
          p {{ item.value }}
    //- Inventory
    div(
      v-if="inventoryTotalQtyInYard"
      class="border-t border-grey-250 mt-2 pt-2 text-grey-900 grid gap-y-2"
    )
      p(class="font-bold text-body2") Inventory
      div(class="flex text-grey-900 text-body2/1.6")
        p(class="w-[70%] pr-6") Available Stock
        p {{ inventoryTotalQtyInYard }}y
  //- Certification
  div(v-if="tagInfo.certificationTagList.length > 0")
    p(class="mb-3 text-body2 font-bold text-grey-900") {{ $t('EE0129') }}
    div(class="flex flex-wrap gap-x-2 gap-y-3")
      f-tag(
        v-for="tag in tagInfo.certificationTagList"
        :key="tag.certificateId"
      ) {{ tag.name }}
  //- Keywords
  div(v-if="tagInfo.tagList.concat(tagInfo.aiTagList).length > 0")
    div(class="flex items-center gap-x-1 mb-3")
      p(class="text-body2 font-bold text-grey-900") Keyword Tags
      f-tooltip-standard(
        :tooltipMessage="'AI determines the Material structure and automatically generates a light green tags.'"
      )
        template(#slot:tooltip-trigger)
          f-svg-icon(iconName="info_outline" size="14")
    div(class="flex flex-wrap gap-x-2 gap-y-3")
      f-tag(v-for="tag in tagInfo.tagList" lg :key="tag") {{ tag }}
      div(
        v-for="tag in tagInfo.aiTagList"
        class="px-3.5 py-2.5 rounded bg-primary-50 text-body2 text-grey-900"
        :key="tag"
      ) {{ tag }}
  //- Eco
  div
    div(class="flex items-center gap-x-1 mb-3")
      p(class="text-body2 font-bold text-grey-900") Eco-Impactor™ Results
      div(
        class="p-1 rounded hover:bg-grey-100 cursor-pointer"
        @click="openModalIndicatorMethodology"
      )
        f-svg-icon(iconName="info_outline" size="14")
    div(class="flex flex-wrap gap-x-4 gap-y-2")
      div(
        v-for="property in carbonEmissionInfo.carbonEmission"
        class="flex items-center gap-x-1"
        :key="property.title"
      )
        f-svg-icon(:iconName="property.icon" size="40" class="text-grey-600")
        div(class="desktop:block flex items-center gap-x-1")
          p(class="text-grey-900 text-caption/1.3") {{ property.title }}
          p(v-if="property.value" class="text-caption/1.6 text-grey-900 font-bold") {{ property.value }}&nbsp{{ property.unitShort }}
          p(v-else class="text-caption/1.6 text-grey-600") {{ '--' }}
            span(class="font-bold") &nbsp{{ property.unitShort }}
  //- 3D Viewer
  div(class="w-full p-4 rounded grid gap-y-4 bg-grey-50")
    material-u3m-viewer-button(
      :materialId="material.materialId"
      :u3m="selectedU3m"
    )
    f-tabs(ref="refTab" :tabList="tabList" keyField="id")
    div(class="flex items-center gap-x-3")
      div(
        v-for="option in u3mDownloadOptionList"
        :key="option.title"
        class="group px-2 py-3 h-11 box-content rounded bg-grey-150 flex-1 flex flex-col justify-between"
        :class="{ 'cursor-pointer': selectedU3m.status === MaterialU3mStatus.COMPLETED }"
        @click="downloadU3m(option.format)"
      )
        div(class="flex items-center gap-x-2")
          p(class="text-caption text-grey-900 font-bold") {{ option.title }}
          f-tooltip-standard(
            :tooltipMessage="'AI determines the Material structure and automatically generates a light green tags.'"
          )
            template(#slot:tooltip-trigger)
              f-svg-icon(iconName="info_outline" size="14" class="text-grey-600")
        f-svg-icon(
          iconName="download"
          size="20"
          :class="[selectedU3m.status === MaterialU3mStatus.COMPLETED ? 'text-grey-900 group-hover:text-primary-400' : 'text-grey-300']"
        )
  //- Sticker
  f-button(
    v-if="drawerOpenFromLocationList"
    prependIcon="sticker_thread"
    size="md"
    class="w-full -mt-2"
    @click="store.dispatch('sticker/preOpenStickerDrawer', { material, drawerOpenFromLocationList })"
  ) Conversation
  //- Specifications
  div(class="text-grey-900 text-body2/1.6 grid gap-y-2")
    p(
      v-if="specificationInfo.seasonInfo.isPublic && specificationInfo.seasonInfo.value"
    ) {{ specificationInfo.seasonInfo.value }}
    p(v-if="specificationInfo.featureList.value.length > 0" class="mb-4") {{ specificationInfo.featureList.value }}
    div(v-if="specificationInfo.materialType" class="grid grid-cols-7 gap-x-6")
      p(class="col-span-2") {{ specificationInfo.materialType.name }}
      div(class="col-span-5 flex items-center gap-x-1.5")
        f-svg-icon(
          :iconName="scanImageStatus.iconName"
          :tooltipMessage="scanImageStatus.tooltipMessage"
          size="20"
          class="text-grey-600"
        )
        p {{ specificationInfo.materialType.value }}
    div(v-if="specificationInfo.contentList" class="grid grid-cols-7 gap-x-6")
      p(class="col-span-2") {{ specificationInfo.contentList.name }}
      p(class="col-span-5") {{ specificationInfo.contentList.value }}
    div(v-if="specificationInfo.weight" class="grid grid-cols-7 gap-x-6")
      p(class="col-span-2") {{ specificationInfo.weight.name }}
      p(class="col-span-5") {{ specificationInfo.weight.value }}
    button(
      class="outline-none px-5 py-2.5 rounded border border-grey-300 text-grey-900 hover:text-primary-400 active:text-primary-400 justify-self-start mt-2 cursor-pointer"
      @click="openModalMaterialSpecification"
    ) View Material Specification
  //- General Info
  f-expansion-panel(class="border-t border-grey-250 pt-6")
    template(#trigger="{ isExpand }")
      div(class="flex items-center justify-between cursor-pointer")
        span(class="text-body2 text-grey-800 font-bold") General Information
        f-svg-icon(
          iconName="keyboard_arrow_right"
          size="20"
          class="transform text-grey-900"
          :class="[isExpand ? '-rotate-90' : 'rotate-90']"
        )
    template(#content)
      div(class="grid gap-y-1.5 text-body2/1.6 pt-3")
        div(class="grid grid-cols-7 gap-x-6")
          p(class="col-span-2") Frontier No
          p(class="col-span-5") {{ material.faceSide?.frontierNo ?? material.backSide?.frontierNo }}
        template(v-if="publishedDate")
          div(class="grid grid-cols-7 gap-x-6")
            p(class="col-span-2") Published By
            p(class="col-span-5") {{ material.metaData.unitName }}
          div(class="grid grid-cols-7 gap-x-6")
            p(class="col-span-2") Published On
            p(class="col-span-5") {{ toStandardFormat(publishedDate) }}
</template>

<script setup lang="ts">
import { computed, toRefs, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import materialForDisplay from '@/utils/material/materialInfoForDisplay'
import { U3M_PROVIDER, U3M_DOWNLOAD_PROP, NOTIFY_TYPE } from '@/utils/constants'
import { FTabs } from '@frontier/ui-component'
import {
  type MaterialU3m,
  type MaterialCustomU3m,
  MaterialU3mStatus,
  type Material,
} from '@frontier/platform-web-sdk'
import useLogSender from '@/composables/useLogSender'
import { downloadDataURLFile, toStandardFormat } from '@frontier/lib'
import useMaterial from '@/composables/material/useMaterial'
import { useStore } from 'vuex'
import MaterialU3mViewerButton from '@/components/common/material/u3m/MaterialU3mViewerButton.vue'

const props = defineProps<{
  material: Material
  publishedDate?: number
  isCanDownloadU3M: boolean
  drawerOpenFromLocationList?: string[]
}>()

const { t } = useI18n()
const store = useStore()
const logSender = useLogSender()

const { specificationInfo, carbonEmissionInfo, scanImageStatus } = useMaterial(
  ref(props.material)
)
const { inventoryTotalQtyInYard, tagInfo } = toRefs(props.material)
const priceInfo = computed(() => {
  const { priceInfo } = props.material
  const {
    countryOfOriginal,
    minimumOrderQty,
    minimumColor,
    productionLeadTimeInDays,
    sampleLeadTimeInDays,
  } = materialForDisplay.priceInfo(priceInfo)

  return {
    countryOfOriginal: priceInfo?.countryOfOriginal ? countryOfOriginal : null,
    minimumOrderQty: priceInfo?.minimumOrder ? minimumOrderQty : null,
    minimumColor: priceInfo?.minimumColor ? minimumColor : null,
    productionLeadTimeInDays: priceInfo?.productionLeadTimeInDays
      ? productionLeadTimeInDays
      : null,
    sampleLeadTimeInDays: priceInfo?.sampleLeadTimeInDays
      ? sampleLeadTimeInDays
      : null,
  }
})

const refTab = ref<InstanceType<typeof FTabs>>()
const tabList = ref([
  {
    id: U3M_PROVIDER.FRONTIER,
    name: t('EE0174'),
  },
  {
    id: U3M_PROVIDER.CUSTOMER,
    name: t('EE0175'),
  },
])
const u3mDownloadOptionList = computed(() => [
  {
    title: t('UU0005'),
    format: U3M_DOWNLOAD_PROP.U3M,
  },
  {
    title: t('UU0058'),
    format: U3M_DOWNLOAD_PROP.U3MA,
  },
  {
    title: t('UU0129'),
    format: U3M_DOWNLOAD_PROP.GLTF,
  },
])
const currentTab = computed<U3M_PROVIDER>(
  () => refTab.value?.currentTab || tabList.value[0].id
)
const selectedU3m = computed<MaterialU3m | MaterialCustomU3m>(() =>
  currentTab.value === U3M_PROVIDER.FRONTIER
    ? props.material.u3m
    : props.material.customU3m
)

const downloadU3m = async (format: U3M_DOWNLOAD_PROP) => {
  if (selectedU3m.value.status !== MaterialU3mStatus.COMPLETED) {
    return
  }

  await store.dispatch('user/getUser')

  const needCheckTokenStatus = [
    'metafabric.design', // 青望科技
    'bluehope.4pt.tw', // 青望科技 Demo 網域
  ].some((hostname) => document.referrer.includes(hostname))

  if (needCheckTokenStatus) {
    const status = await store.dispatch('checkTokenStatus', {
      accessToken: localStorage.getItem('accessToken'),
    })

    if (status === 1) {
      parent.postMessage({ error: 'Unauthorized' }, document.referrer)
      return
    } else if (status === 2) {
      parent.postMessage({ error: 'Unverified' }, document.referrer)
      return
    }
  }

  if (!props.isCanDownloadU3M) {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('II0003'),
      contentText: t('II0004'),
      primaryBtnText: t('UU0031'),
    })
    return
  }

  const url = selectedU3m.value[format]!
  const fileName = url.split('/')[url.split('/').length - 1]
  downloadDataURLFile(url, fileName)
  logSender.createDownloadLog(props.material.materialId, format)
}

const openModalMaterialSpecification = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-material-specification',
    properties: {
      material: props.material,
    },
  })
}

const openModalIndicatorMethodology = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-indicator-methodology',
  })
}
</script>
