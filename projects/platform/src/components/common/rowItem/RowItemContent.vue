<template lang="pug">
div(class="w-full min-w-42.5 max-w-67.5 col-span-3")
  div(class="text-body2 font-bold text-grey-900 line-clamp-2 mb-2.5") {{ material.itemNo }}
  slot(name="slot:unit-info")
  div(
    class="w-full relative aspect-square"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  )
    file-display(
      :displayUrl="currentCoverImage"
      :originalUrl="currentCoverImage"
      :extension="Extension.JPG"
      class="w-full h-full"
    )
    div(
      v-if="isHover"
      class="absolute z-9 inset-0 w-full h-full rounded bg-grey-900/70"
      @click.stop="canEdit && goToAssetMaterialDetail({}, material.materialId)"
    )
    //- 目前在 Moodboard的 多選功能只有 export，而 export 需要等 online spreadsheet 功能上線後才能開啟
    //- 而 canEdit 屬性在在 Moodboard (RowItemNodeMoodboard) 中為 false 所以暫時加上此邏輯，讓它中不能被選取
    div(
      v-if="canEdit && (isHover || haveSelectedMoreThanOne)"
      class="absolute z-10 inset-0 w-full h-12"
    )
      div(class="bg-linear w-full h-full rounded-t-md")
      f-input-checkbox(
        v-model:inputValue="innerSelectedList"
        :value="material"
        class="absolute top-3 left-3"
        iconColor="text-grey-0"
        uncheckColor="text-grey-0"
      )
  div(class="my-2 text-body2 text-grey-900")
    p(:class="['line-clamp-1', specificationInfo.seasonInfo.textColor]") {{ specificationInfo.seasonInfo.value }}
    p(:class="['line-clamp-1', specificationInfo.featureList.textColor]") {{ specificationInfo.featureList.value }}
  div(class="flex items-center")
    f-svg-icon(
      :iconName="scanImageStatus.iconName"
      :tooltipMessage="scanImageStatus.tooltipMessage"
      size="24"
      class="text-grey-900 pr-3"
    )
    slot(name="slot:action" :isHover="isHover")
div(class="grid gap-x-14 grid-cols-2 col-span-8")
  div(class="min-w-75 max-w-115")
    div(class="flex justify-between pb-2 border-grey-250 border-b mb-2")
      p(class="text-body2/1.6 font-bold text-grey-900") {{ $t('RR0130') }}
      f-button-label(
        v-if="canEdit"
        @click="openModalMaterialEditSimple('spec')"
      ) {{ $t('UU0027') }}
    f-input-tap(
      :optionList="innerSideOptionList"
      :inputValue="isShowOriginalCoverImage ? SIDE_COVER : currentSideType"
      @update:inputValue="innerSwitchSideType"
      class="pb-3"
    )
    f-infobar(
      v-if="material.isAutoSyncFaceToBackSideInfo && currentSideType === MATERIAL_SIDE_TYPE.BACK"
      :notifyType="NOTIFY_TYPE.TIPS"
      :messageText="'Same material information on the back and face.'"
    )
    block-specification(
      v-else
      :specificationInfo="specificationInfo"
      isListView
    )
  div(class="flex flex-col gap-y-6 min-w-75 max-w-115")
    div
      div(class="flex justify-between pb-2 border-grey-250 border-b mb-2")
        p(class="text-body2/1.6 font-bold text-grey-900") {{ $t('RR0135') }}
        f-button-label(
          v-if="canEdit"
          @click="openModalMaterialEditSimple('inventory')"
        ) {{ $t('UU0027') }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0034') }}： {{ material.inventoryTotalQtyInYard }}
    div
      div(class="flex justify-between pb-2 border-grey-250 border-b mb-2")
        p(class="text-body2/1.6 font-bold text-grey-900") {{ $t('RR0134') }}
        f-button-label(
          v-if="canEdit"
          @click="openModalMaterialEditSimple('public-price')"
        ) {{ $t('UU0027') }}
      div(class="grid gap-3")
        p(class="text-body2 !break-all") {{ pricing.name }}： {{ pricing.value }}
    div
      div(class="flex justify-between pb-2 border-grey-250 border-b mb-2")
        p(class="text-body2/1.6 font-bold text-grey-900") {{ $t('RR0133') }}
        f-button-label(
          v-if="canEdit"
          @click="openModalMaterialEditSimple('tag')"
        ) {{ $t('UU0027') }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0027') }}： {{ publicTagList }}
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0028') }}： {{ privateTagList }}
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
      div(
        v-if="made2flowSubscribed && carbonEmissionInfo.carbonEmission"
        class="flex items-center gap-x-4 pt-3"
      )
        div(
          v-for="property in carbonEmissionInfo.carbonEmission"
          :key="property.title"
          class="flex items-center gap-x-2"
        )
          f-svg-icon(:iconName="property.icon" size="20")
          p(v-if="property.value" class="text-body2 text-grey-900") {{ property.value }} {{ property.unitShort }}
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Extension, type Material } from '@frontier/platform-web-sdk'
import useMaterial from '@/composables/material/useMaterial'
import useNavigation from '@/composables/useNavigation'
import {
  VALUE_ADDED_SERVICE_ID,
  DISPLAY,
  MATERIAL_SIDE_TYPE,
  NOTIFY_TYPE,
} from '@/utils/constants'
import listViewMask from '@/assets/images/list_view_mask.png'
import BlockSpecification from '@/components/common/material/detail/internal/BlockSpecification.vue'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import FileDisplay from '@/components/common/material/file/FileDisplay.vue'

const props = defineProps<{
  canEdit: boolean
  selectedList: Material[]
  material: Material
}>()

const emit = defineEmits<{
  (e: 'update:selectedList', v: Material[]): void
}>()

const store = useStore()
const router = useRouter()
const { goToAssetMaterialDetail } = useNavigation()
const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

const innerSelectedList = computed({
  get: () => props.selectedList,
  set: (v) => emit('update:selectedList', v),
})

const {
  currentSideType,
  switchSideType,
  sideOptionList,
  specificationInfo,
  carbonEmissionInfo,
  scanImageStatus,
} = useMaterial(ref(props.material))

const publicTagList = computed(() => {
  const { tagList, aiTagList } = props.material.tagInfo
  return tagList.concat(aiTagList).join(', ')
})
const privateTagList = computed(() => {
  return props.material.internalInfo?.tagList.join(', ') ?? ''
})
const pricing = computed(() => {
  return materialInfoForDisplay.priceInfo(props.material.priceInfo).pricing
})

const SIDE_COVER = 0
const isShowOriginalCoverImage = ref(true)
const currentCoverImage = ref(props.material.coverImage?.displayUrl)
type SideType = MATERIAL_SIDE_TYPE | typeof SIDE_COVER
const innerSideOptionList = computed(() => {
  return [
    {
      label: 'Cover',
      selectValue: SIDE_COVER,
    },
    ...sideOptionList.value.map((sideOption) => {
      return {
        selectValue: sideOption.selectValue,
        icon: sideOption.icon,
        selectedIcon: sideOption.selectedIcon,
      }
    }),
  ] as {
    label?: string
    selectValue: SideType
    icon?: string
    selectedIcon?: string
  }[]
})
const innerSwitchSideType = (sideType: SideType) => {
  if (sideType !== SIDE_COVER) {
    switchSideType(sideType)
    isShowOriginalCoverImage.value = false

    if (currentSideType.value === MATERIAL_SIDE_TYPE.FACE) {
      currentCoverImage.value =
        props.material.faceSide?.sideImage?.thumbnailUrl ?? null
    } else if (currentSideType.value === MATERIAL_SIDE_TYPE.BACK) {
      currentCoverImage.value =
        props.material.backSide?.sideImage?.thumbnailUrl ?? null
    }
  } else {
    isShowOriginalCoverImage.value = true
    currentCoverImage.value = props.material.coverImage?.thumbnailUrl
  }
}

const isHover = ref(false)

const haveSelectedMoreThanOne = computed(() => props.selectedList.length > 0)

const made2flowSubscribed = computed(
  () => store.getters['polling/valueAddedService'].made2flow.planStatus.ACTIVATE
)

const openModalMaterialEditSimple = async (type: string) => {
  const materialOptionsRes = await ogBaseAssetsApi('getMaterialOptions')
  const materialOptions = materialOptionsRes.data.result!

  store.dispatch('helper/openModalBehavior', {
    component: `modal-material-edit-simple-${type}`,
    properties: { material: props.material, materialOptions },
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
