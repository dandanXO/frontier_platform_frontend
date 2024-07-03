<template lang="pug">
div(class="grid gap-y-8 content-start")
  //- Price
  div(v-if="material.priceInfo")
    div(v-if="material.priceInfo.pricing" class="flex items-end gap-x-1 mb-5")
      p(class="text-grey-900 font-bold text-body1") $ {{ material.priceInfo.pricing.price }}
      p(class="text-grey-600 text-caption") {{ material.priceInfo.pricing.currencyCode }} / {{ material.priceInfo.pricing.unit }}
      p(v-if="material.inventoryTotalQtyInYard" class="text-grey-600 text-caption") ({{ material.inventoryTotalQtyInYard }}{{ material.inventoryUnit }} available)
    div(class="grid gap-y-2")
      template(v-for="item in priceInfo" :key="item")
        div(v-if="item" class="flex text-grey-900 text-body2/1.6")
          p(class="w-[70%] pr-6") {{ item.name }}
          p {{ item.value }}
    //- Inventory
    div(
      v-if="material.inventoryTotalQtyInYard"
      class="border-t border-grey-250 mt-2 pt-2 text-grey-900 grid gap-y-2"
    )
      p(class="font-bold text-body2") Inventory
      div(class="flex text-grey-900 text-body2/1.6")
        p(class="w-[70%] pr-6") Available Stock
        p {{ material.inventoryTotalQtyInYard }}{{ material.inventoryUnit }}
  //- Certification
  div(v-if="material.tagInfo.certificationTagList.length > 0")
    p(class="mb-3 text-body2 font-bold text-grey-900") {{ $t('EE0129') }}
    div(class="flex flex-wrap gap-x-2 gap-y-3")
      f-tag(
        v-for="tag in material.tagInfo.certificationTagList"
        :key="tag.certificateId"
      ) {{ tag.name }}
  //- Keywords
  div(v-if="material.tagInfo.tagList.length > 0")
    div(class="flex items-center gap-x-1 mb-3")
      p(class="text-body2 font-bold text-grey-900") Keyword Tags
    div(class="flex flex-wrap gap-x-2 gap-y-3")
      f-tag(v-for="tag in material.tagInfo.tagList" lg :key="tag") {{ tag }}
  //- Eco
  div
    div(class="flex items-center gap-x-1 mb-3")
      p(class="text-body2 font-bold text-grey-900") {{ $t('BB0130') }}
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
    f-tooltip-standard(
      :tooltipMessage="U3M_PROVIDER.FRONTIER === currentTab ? $t('EE0213') : $t('EE0212')"
      class="flex-grow w-full"
      :disabledTooltip="disabledTooltipErrorMessage()"
    )
      template(#slot:tooltip-trigger)
        material-u3m-viewer-react-button(
          v-if="store.getters['permission/isShowNew3DViewer']"
          :material="material"
          :materialId="material.materialId"
          :u3m="selectedU3m"
          :disabled="threeDViewerDisabledMap[U3M_PROVIDER.FRONTIER === currentTab ? U3M_PROVIDER.FRONTIER : U3M_PROVIDER.CUSTOMER]"
        )
        material-u3m-viewer-button(
          v-else
          class="w-full"
          :material="material"
          :materialId="material.materialId"
          :u3m="selectedU3m"
          :disabled="threeDViewerDisabledMap[U3M_PROVIDER.FRONTIER === currentTab ? U3M_PROVIDER.FRONTIER : U3M_PROVIDER.CUSTOMER]"
        )
    f-tabs(
      ref="refTab"
      :tabList="tabList"
      :initValue="defaultTab(material)"
      keyField="id"
    )
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
            :tooltipTitle="$t('MI0133')"
            :tooltipMessage="option.tooltipMessage"
          )
            template(#slot:tooltip-trigger)
              f-svg-icon(iconName="info_outline" size="14" class="text-grey-600")
        f-svg-icon(
          iconName="download"
          size="20"
          :tooltipMessage="selectedU3m.status === MaterialU3mStatus.COMPLETED ? $t('RR0059') : $t('II0070')"
          :class="[selectedU3m.status === MaterialU3mStatus.COMPLETED ? 'text-grey-900 group-hover:text-primary-400' : 'text-grey-300']"
        )
  //- Sticker
  f-button(
    v-if="drawerOpenFromLocationList"
    prependIcon="sticker_thread"
    size="md"
    class="w-full -mt-2"
    @click="store.dispatch('sticker/preOpenStickerDrawer', { material, drawerOpenFromLocationList })"
  ) {{ $t('UU0141') }}
  //- Specifications
  div(class="text-grey-900 text-body2/1.6 grid gap-y-2")
    p(
      v-if="specificationInfo.seasonInfo.isPublic && specificationInfo.seasonInfo.value"
    ) {{ specificationInfo.seasonInfo.value }}
    p(v-if="specificationInfo.featureList.value.length > 0" class="mb-4 break-word") {{ specificationInfo.featureList.value }}
    div(v-if="specificationInfo.materialType" class="grid grid-cols-7 gap-x-6")
      p(class="col-span-2") {{ specificationInfo.materialType.name }}
      div(class="col-span-5 flex items-start gap-x-1.5")
        f-svg-icon(
          :iconName="scanImageStatus.iconName"
          :tooltipMessage="scanImageStatus.tooltipMessage"
          size="20"
          class="text-grey-600 break-word mt-[2px]"
        )
        p(class="break-word") {{ specificationInfo.materialType.value }}
    div(v-if="specificationInfo.contentList" class="grid grid-cols-7 gap-x-6")
      p(class="col-span-2") {{ specificationInfo.contentList.name }}
      p(class="col-span-5 break-word") {{ specificationInfo.contentList.value }}
    div(v-if="specificationInfo.weight" class="grid grid-cols-7 gap-x-6")
      p(class="col-span-2") {{ specificationInfo.weight.name }}
      p(class="col-span-5 break-word") {{ specificationInfo.weight.value }}
    button(
      class="outline-none px-5 py-2.5 rounded border border-grey-300 text-grey-900 hover:text-primary-400 active:text-primary-400 justify-self-start mt-2 cursor-pointer"
      @click="openModalMaterialSpecification"
    ) {{ $t('UU0142') }}
  //- Attachment
  f-expansion-panel(class="border-t border-grey-250 pt-6")
    template(#trigger="{ isExpand }")
      div(class="flex items-center justify-between cursor-pointer")
        span(class="text-body2 text-grey-800 font-bold") {{ $t('RR0298') }}
        f-svg-icon(
          iconName="keyboard_arrow_right"
          size="20"
          class="transform text-grey-900"
          :class="[isExpand ? '-rotate-90' : 'rotate-90']"
        )
    template(#content)
      div(
        v-if="multimediaList && multimediaList.length > 0"
        class="flex flex-wrap gap-5 pt-3"
      )
        multimedia-card(
          v-for="(multimedia, index) in multimediaList"
          :canStar="false"
          :key="multimedia.fileId"
          :thumbnailUrl="multimedia.thumbnailUrl"
          :originalUrl="multimedia.originalUrl"
          :extension="multimedia.extension"
          :displayFileName="multimedia.displayFileName"
          :menuTree="getExternalMultimediaMenuTree(multimedia.fileId)"
          @click="openMultimediaViewMode(index)"
        )
  //- General Info
  f-expansion-panel(class="border-t border-grey-250 pt-6")
    template(#trigger="{ isExpand }")
      div(class="flex items-center justify-between cursor-pointer")
        span(class="text-body2 text-grey-800 font-bold") {{ $t('MI0117') }}
        f-svg-icon(
          iconName="keyboard_arrow_right"
          size="20"
          class="transform text-grey-900"
          :class="[isExpand ? '-rotate-90' : 'rotate-90']"
        )
    template(#content)
      div(class="grid gap-y-1.5 text-body2/1.6 pt-3")
        div(class="grid grid-cols-7 gap-x-6")
          p(class="col-span-2") {{ $t('RR0084') }}
          p(class="col-span-5") {{ material.faceSide?.frontierNo ?? material.backSide?.frontierNo }}
        template(v-if="publishedDate")
          div(class="grid grid-cols-7 gap-x-6")
            p(class="col-span-2") {{ $t('RR0322') }}
            p(class="col-span-5") {{ material.metaData.unitName }}
          div(class="grid grid-cols-7 gap-x-6")
            p(class="col-span-2") {{ $t('RR0323') }}
            p(class="col-span-5") {{ toStandardFormat(publishedDate) }}
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import materialForDisplay from '@/utils/material/materialInfoForDisplay'
import {
  U3M_PROVIDER,
  U3M_DOWNLOAD_PROP,
  NOTIFY_TYPE,
  U3M_STATUS,
} from '@/utils/constants'
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
import useMultimediaUpdate from '@/composables/material/useMultimediaUpdate'
import { useStore } from 'vuex'
import MaterialU3mViewerReactButton from '@/components/common/material/u3m/MaterialU3mViewerReactButton.vue'
import MaterialU3mViewerButton from '@/components/common/material/u3m/MaterialU3mViewerButton.vue'
import { useRoute } from 'vue-router'
import MultimediaCard from '@/components/common/material/multimedia/MultimediaCard.vue'
import useU3mDownloadTabs from '@/composables/material/useU3mDownloadTabs'
import { checkU3mImageExist } from '@/utils/3dViewer/checkU3mImageExist'

const props = defineProps<{
  material: Material
  publishedDate?: number
  isCanDownloadU3M: boolean
  drawerOpenFromLocationList?: string[]
}>()

const { t } = useI18n()
const store = useStore()
const logSender = useLogSender()
const route = useRoute()

const {
  specificationInfo,
  carbonEmissionInfo,
  scanImageStatus,
  publicFileList,
} = useMaterial(ref(props.material))
const { multimediaList, getExternalMultimediaMenuTree, material } =
  useMultimediaUpdate(ref(props.material), () => {})
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

const { refTab, tabList, currentTab, defaultTab, u3mDownloadOptionList } =
  useU3mDownloadTabs()

const selectedU3m = computed<MaterialU3m | MaterialCustomU3m>(() =>
  currentTab.value === U3M_PROVIDER.FRONTIER
    ? props.material.u3m
    : props.material.customU3m
)

const downloadU3m = async (format: U3M_DOWNLOAD_PROP) => {
  if (selectedU3m.value.status !== MaterialU3mStatus.COMPLETED) {
    return
  }

  if (!route.path.includes('embed')) {
    await store.dispatch('user/getUser')
  }

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

const multimediaViewModeFileList = computed(() =>
  multimediaList.value.map((m) => ({
    id: m.fileId,
    originalUrl: m.originalUrl,
    displayUrl: m.originalUrl,
    thumbnailUrl: m.thumbnailUrl,
    displayName: m.displayFileName,
    extension: m.extension,
  }))
)

const openMultimediaViewMode = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList: multimediaViewModeFileList,
        getMenuTree: getExternalMultimediaMenuTree,
      },
    },
  })
}
const threeDViewerDisabledMap: {
  [U3M_PROVIDER.CUSTOMER]: boolean
  [U3M_PROVIDER.FRONTIER]: boolean
} = reactive({
  1: true,
  2: true,
})
const disabledTooltipErrorMessage = () => {
  if (selectedU3m.value.status === U3M_STATUS.COMPLETED) {
    return !threeDViewerDisabledMap[
      U3M_PROVIDER.FRONTIER === currentTab.value
        ? U3M_PROVIDER.FRONTIER
        : U3M_PROVIDER.CUSTOMER
    ]
  } else {
    return true
  }
}

onMounted(async () => {
  threeDViewerDisabledMap[U3M_PROVIDER.FRONTIER] = await checkU3mImageExist(
    props.material?.u3m
  )
  threeDViewerDisabledMap[U3M_PROVIDER.CUSTOMER] = await checkU3mImageExist(
    props.material?.customU3m
  )
})
</script>
