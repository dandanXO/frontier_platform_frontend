<template lang="pug">
div(class="flex flex-row justify-between")
  h5(class="text-h5/1.5 font-bold text-grey-900") {{ material.itemNo }}
  div(class="flex items-center gap-x-4")
    f-popper(class="cursor-pointer" placement="left-start")
      template(#trigger)
        f-tooltip-standard(
          :tooltipMessage="$t('RR0260')"
          boundaryReference="search-table-header"
          data-cy="material-detail-internal-moreOptions"
        )
          template(#slot:tooltip-trigger)
            f-button(size="lg" type="secondary" isIcon)
              f-svg-icon(iconName="more" size="24")
      template(#content="{ collapsePopper }")
        f-contextual-menu(
          :menuTree="menuTree"
          @click:menu="collapsePopper"
          data-cy="f-contextual-menu"
        )
    f-tooltip-standard(
      :tooltipMessage="$t('RR0380')"
      :disabledTooltip="editable"
    )
      template(#slot:tooltip-trigger)
        f-button(
          v-permission="{ FUNC_ID: FUNC_ID.ASSET_EDIT, behavior: 'deleteElement' }"
          :disabled="!editable"
          prependIcon="create"
          size="lg"
          @click="editMaterial.func(material)"
        ) {{ $t('RR0054') }}
div(class="flex flex-row gap-8" data-theme="new" ref="containerRef")
  //- Left Side: Image 
  div(class="flex flex-col gap-8 h-fit min-h-0" ref="leftSideRef")
    material-detail-image(
      :availableFileList="availableFileList"
      :currentSideType="currentSideType"
      :material="material"
    )
    material-detail-u3m(:material="material")

  //- Right Side: Item#, Spec, Color and Pattern, 3D Material
  div(
    class="w-full flex flex-col flex-grow-0 flex-shrink overflow-y-auto pr-2"
    :style="{ maxHeight: leftSideHeight + 'px' }"
    ref="rightSideRef"
  )
    div(
      class="pb-6"
      v-if="platformLocationType === PLATFORM_LOCATION_TYPE.INNER_EXTERNAL"
    )
      div(class="flex items-center gap-x-1")
        f-avatar(type="org" :imageUrl="material.metaData.unitLogo" size="md")
        p(class="text-body2/1.6 text-grey-800 font-bold break-words") {{ material.metaData.unitName }}
    div(class="flex flex-col gap-8")
      f-accordion(:title="$t('MI0005')")
        specification-section(:material="material" :class="SECTION_CLASS")

      f-accordion(
        :title="tagsTitle"
        :desc="tagsDesc"
        :viewOnly="isTagsTabsEmpty"
      )
        tags-section(:class="SECTION_CLASS" v-if="!isTagsTabsEmpty")
      f-accordion(
        :title="$t('EE0129')"
        :desc="certList.length ? undefined : $t('RR0564')"
        :viewOnly="!certList.length"
      )
        div(
          class="!flex-row w-full flex-wrap"
          :class="SECTION_CLASS"
          v-if="certList.length"
        )
          f-tag(
            v-for="tag in certList"
            :key="`certifications-${tag.certificateId}`"
            size="md"
            :clickable="false"
          ) {{ tag.name }}
      f-accordion(
        :title="$t('RR0134')"
        :desc="withPrices ? undefined : $t('RR0565')"
        :viewOnly="!withPrices"
      )
        price-section(
          :material="material"
          :class="SECTION_CLASS"
          v-if="withPrices"
        )
      f-accordion(
        :title="$t('RR0135')"
        :desc="withInventoryData ? undefined : $t('RR0566')"
        :viewOnly="!withInventoryData"
      )
        inventory-section(
          :material="material"
          :class="SECTION_CLASS"
          v-if="withInventoryData"
        )
      f-accordion(
        :title="$t('RR0298')"
        :desc="withAttachments ? $t('RR0558') : $t('RR0563')"
        :viewOnly="!withAttachments"
      )
        attachments-section(
          :material="material"
          :class="SECTION_CLASS"
          v-if="withAttachments"
        )
      f-accordion(:title="$t('RR0254')")
        eco-impactor-section(:material="material" :class="SECTION_CLASS")
      f-accordion(:title="$t('RR0452')")
        star-trust-section(:material="material" :class="SECTION_CLASS")
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  nextTick,
  onUnmounted,
  toRef,
  onUpdated,
} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import type { Material } from '@frontier/platform-web-sdk'
import {
  type MenuBlock,
  type MenuItem,
  type MenuTree,
} from '@frontier/ui-component'
import { useCustomFieldStore } from '@/stores/customField'
import {
  PLATFORM_LOCATION_TYPE,
  ATTACHMENT_FILE_ACCEPT_TYPE,
  FUNC_ID,
  PERMISSION_MAP,
} from '@/utils/constants'
import useMaterial from '@/composables/material/useMaterial'
import type { Location, MaterialFile } from '@/types'
import MaterialDetailImage from '@/components/common/material/detail/internal/MaterialDetailImage.vue'
import MaterialDetailU3m from '@/components/common/material/detail/MaterialDetailU3m.vue'
import useAssets from '@/composables/useAssets'
import useTagSection from '@/composables/material/useTagsSection'
import usePriceSection from '@/composables/material/usePriceSection'
import useInventorySection from '@/composables/material/useInventorySection'
import SpecificationSection from '../SpecificationSection.vue'
import TagsSection from '../TagsSection.vue'
import PriceSection from '../PriceSection.vue'
import InventorySection from '../InventorySection.vue'
import AttachmentsSection from '../AttachmentsSection.vue'
import EcoImpactorSection from '../EcoImpactorSection.vue'
import StarTrustSection from '../StarTrustSection.vue'

const SECTION_CLASS = 'flex flex-col gap-3'

const props = defineProps<{
  material: Material
  platformLocationType: PLATFORM_LOCATION_TYPE
  locationList: Location[]
}>()
const { t } = useI18n()
const store = useStore()
const route = useRoute()
const roleId = store.getters['organization/orgUser/orgUser'].roleID

const materialPropsRef = toRef(props, 'material')

const { publicFileList, currentSideType } = useMaterial(materialPropsRef)
const {
  isTabsEmpty: isTagsTabsEmpty,
  desc: tagsDesc,
  title: tagsTitle,
  ...resTagSection
} = useTagSection()
const { withPrivatePrices, withPublicPrices, ...resPriceSection } =
  usePriceSection()
const withPrices = computed(
  () => withPrivatePrices.value || withPublicPrices.value
)
const { inventorySections, ...resInventorySection } = useInventorySection()
const customFieldStore = useCustomFieldStore()
const { getCustomFieldList } = customFieldStore

const withInventoryData = computed(
  () =>
    inventorySections.value.length && props.material.internalInfo?.nativeCode
)

const withAttachments = computed(
  () =>
    props.material.multimediaList.length ||
    props.material.internalInfo?.attachmentList?.length
)

const {
  editMaterial,
  downloadU3m,
  cloneTo,
  addToWorkspace,
  createU3m,
  printLabel,
  printA4Swatch,
  deleteMaterial,
} = useAssets()
const editable = computed(() => {
  if (!props.material.metaData.isProcessingComplete) {
    return false
  }
  return true
})

// Refs for the container and sides
const containerRef = ref<HTMLElement | null>(null)
const leftSideRef = ref<HTMLElement | null>(null)
const rightSideRef = ref<HTMLElement | null>(null)
const leftSideHeight = ref(0)

// Function to update the height
const updateHeight = async () => {
  await nextTick()
  if (leftSideRef.value) {
    leftSideHeight.value = leftSideRef.value.offsetHeight
  }
}

let observer: MutationObserver | null = null

// Update on mount and window resize
onMounted(() => {
  ;[resTagSection, resPriceSection, resInventorySection].map((section) =>
    section.setMaterial(props.material)
  )
  updateHeight()
  window.addEventListener('resize', updateHeight)

  // Set up a MutationObserver to watch for DOM changes in the left side
  if (leftSideRef.value) {
    observer = new MutationObserver(updateHeight)
    observer.observe(leftSideRef.value, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
})

onUpdated(() => {
  getCustomFieldList()
})

// remove resize listener
onUnmounted(() => {
  window.removeEventListener('resize', updateHeight)
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

const menuTree = computed<MenuTree>(() => {
  // List placeholders
  const funcOneList: any[] = []
  const funTwoList = [downloadU3m]
  const optionList = [funTwoList, [printLabel, printA4Swatch]]

  // Retrieve the user's role and corresponding permissions
  const permissionList = PERMISSION_MAP[roleId]

  // Map each permission ID to its handler function
  const permissionHandlerMap = {
    [FUNC_ID.ASSET_EDIT]: () => {
      // If user can edit, add [editMaterial] to the front of optionList
      editable.value && optionList.unshift([editMaterial])
    },
    [FUNC_ID.ASSET_COPY]: () => {
      // If user can copy, push cloneTo into funcOneList
      funcOneList.push(cloneTo)
    },
    [FUNC_ID.ASSET_ADD_TO_WORK_SPACE]: () => {
      // If user can add to workspace, push addToWorkspace into funcOneList
      funcOneList.push(addToWorkspace)
    },
    [FUNC_ID.ASSETS_3DVIEWER_EDIT]: () => {
      // If user can edit 3D viewer, add createU3m to the front of funTwoList
      funTwoList.unshift(createU3m)
    },
    [FUNC_ID.ASSET_DELETE]: () => {
      // If user can delete, push [deleteMaterial] into optionList
      optionList.push([deleteMaterial])
    },
  }

  // Iterate over permissionList and execute the corresponding handlers
  permissionList.forEach((permission) => {
    if (permissionHandlerMap[permission]) {
      permissionHandlerMap[permission]()
    }
  })

  // After populating funcOneList, if it has items, add it to the front of optionList
  if (funcOneList.length > 0) {
    optionList.unshift(funcOneList)
  }

  // & symbol is used as an intersection type operator to combine multiple types into one that includes all properties from the constituent types.
  const material: Material & { routerBackNodeId?: number } = props.material
  const blockList: MenuBlock[] = optionList.map((block) => ({
    menuList: block.map((option) => ({
      title: option.name(props.material),
      clickHandler: () => option.func(material),
      disabled: option.disabled ? option.disabled(props.material) : false,
      testId: option.testId,
    })),
  }))
  const digitalThreadMenu: MenuItem = {
    title: t('TT0001'),
    clickHandler: () => {
      store.dispatch('sticker/preOpenStickerDrawer', {
        material,
        drawerOpenFromLocationList: props.locationList.map((l) => l.name),
      })
    },
  }

  blockList.push({
    menuList: [digitalThreadMenu],
  })

  material.routerBackNodeId = Number(route.query.preLayerNodeId) || undefined
  return {
    blockList,
  }
})

const availableFileList = publicFileList.value.filter((item: MaterialFile) => {
  if (store.getters['permission/isDigitalDrapeTrialRule']) {
    return ATTACHMENT_FILE_ACCEPT_TYPE.includes(item.extension)
  } else {
    return (
      ATTACHMENT_FILE_ACCEPT_TYPE.includes(item.extension) &&
      item.id !== 'digitalDrape'
    )
  }
})

const certList = computed(() => props.material.tagInfo.certificationTagList)
</script>
