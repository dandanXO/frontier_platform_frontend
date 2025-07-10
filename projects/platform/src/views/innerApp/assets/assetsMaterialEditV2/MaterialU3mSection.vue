<template>
  <!-- 3D -->
  <div class="bg-white rounded-2xl">
    <div
      class="flex items-center p-5 border text-grey-900 border-grey-200-v1 rounded-t-2xl"
    >
      <h5 class="font-bold text-h5">{{ $t('RR0132') }}</h5>
      <f-tooltip-media
        placement="bottom"
        class="pl-1"
        :tooltipTitle="$t('UU0029')"
        :tooltipMessage="$t('EE0066')"
        :imageUrl="u3mInstructionImage"
      >
        <template #slot:tooltip-trigger>
          <f-svg-icon
            iconName="info_outline"
            class="cursor-pointer"
            size="14"
          />
        </template>
      </f-tooltip-media>
    </div>

    <div
      class="p-5 border-b border-l border-r border-grey-200-v1 rounded-b-2xl"
    >
      <f-expansion-panel>
        <template #trigger="{ isExpand }">
          <div class="flex items-center h-15 gap-x-1">
            <f-svg-icon
              iconName="arrow_drop_down"
              size="24"
              class="transition-transform duration-200 text-grey-900"
              :class="{ 'rotate-180': isExpand }"
            />
            <p class="font-bold text-body2 text-grey-800">
              {{ $t('EE0174') }}
            </p>
          </div>
        </template>
        <template #content>
          <div class="-mt-2.5 mb-5 flex flex-col gap-y-2.5 pl-7">
            <div class="flex items-center gap-x-2">
              <f-tooltip-standard
                isNotFitWidth
                :tooltipMessage="$t('EE0213')"
                class=""
                :disabledTooltip="
                  disabledTooltipErrorMessage(U3M_PROVIDER.FRONTIER)
                "
              >
                <template #slot:tooltip-trigger>
                  <div class="flex gap-2">
                    <material-u3m-viewer-react-button
                      v-if="store.getters['permission/isShowNew3DViewer']"
                      :material="material"
                      :materialId="material.materialId"
                      :u3m="material.u3m"
                      :disabled="threeDViewerDisabledMap[U3M_PROVIDER.FRONTIER]"
                      class="flex-1"
                    />
                    <material-u3m-viewer-button
                      v-else
                      :material="material"
                      :materialId="material.materialId"
                      :u3m="material.u3m"
                      :disabled="threeDViewerDisabledMap[U3M_PROVIDER.FRONTIER]"
                      class="flex-1"
                    />
                    <custom-button
                      type="secondary"
                      v-if="material.u3m.status === COMPLETED"
                      @click="handleCreateU3m"
                      class="flex-1"
                    >
                      {{ $t('UU0030') }}
                    </custom-button>
                    <custom-button
                      type="secondary"
                      v-if="material.u3m.status === INITIAL"
                      class="flex-1"
                      @click="handleCreateU3m"
                    >
                      {{ $t('RR0278') }}
                    </custom-button>
                    <custom-button
                      type="secondary"
                      v-if="material.u3m.status === UNSUCCESSFUL"
                      class="flex-1"
                      @click="handleCreateU3m"
                    >
                      {{ $t('UU0082') }}
                    </custom-button>
                  </div>
                </template>
              </f-tooltip-standard>
            </div>
            <material-u3m-status-block :u3m="material.u3m">
            </material-u3m-status-block>
            <f-infobar
              v-if="showU3mWarning"
              class="w-full"
              :notifyType="NOTIFY_TYPE.WARNING"
              :messageText="t('RR0590')"
            />
            <f-infobar
              v-if="showU3mRegenerateInfo"
              class="w-full"
              :notifyType="NOTIFY_TYPE.INFO"
              :title="$t('RR0058')"
              :messageText="t('RR0589')"
            />
          </div>
        </template>
      </f-expansion-panel>

      <f-expansion-panel class="border-t border-grey-250">
        <template #trigger="{ isExpand }">
          <div class="flex items-center h-15 gap-x-1">
            <f-svg-icon
              iconName="arrow_drop_down"
              size="24"
              class="transition-transform duration-200 text-grey-900"
              :class="{ 'rotate-180': isExpand }"
            />
            <div class="flex items-center gap-x-1">
              <p class="font-bold text-body2 text-grey-800">
                {{ $t('EE0175') }}
              </p>
              <f-tooltip-standard :tooltipMessage="$t('EE0166')">
                <template #slot:tooltip-trigger>
                  <f-svg-icon
                    iconName="info_outline"
                    class="cursor-pointer"
                    size="14"
                  />
                </template>
              </f-tooltip-standard>
            </div>
          </div>
        </template>
        <template #content>
          <div class="-mt-2.5 flex flex-col gap-y-2.5 pl-7">
            <div class="flex flex-col gap-y-2">
              <div class="flex flex-row gap-x-2">
                <f-tooltip-standard
                  :tooltipMessage="$t('EE0212')"
                  class="flex-1"
                  :disabledTooltip="
                    disabledTooltipCostomerErrorMessage(U3M_PROVIDER.CUSTOMER)
                  "
                >
                  <template #slot:tooltip-trigger>
                    <material-u3m-viewer-react-button
                      v-if="store.getters['permission/isShowNew3DViewer']"
                      :material="material"
                      :materialId="material.materialId"
                      :u3m="material.u3m"
                      :disabled="threeDViewerDisabledMap[U3M_PROVIDER.CUSTOMER]"
                      class="w-full"
                    />
                    <material-u3m-viewer-button
                      v-else
                      :material="material"
                      :materialId="material.materialId"
                      :u3m="material.customU3m"
                      :disabled="threeDViewerDisabledMap[U3M_PROVIDER.CUSTOMER]"
                      class="w-full"
                    />
                  </template>
                </f-tooltip-standard>

                <block-material-upload-u3m-v2
                  :mode="CREATE_EDIT.EDIT"
                  :status="material.customU3m.status"
                  class="flex-1"
                />
              </div>
              <div v-if="hasUploadedU3mFile" class="flex flex-col gap-y-2 max-w-72.5">
                <div class="flex items-center px-4 py-3 rounded bg-grey-100">
                  <div
                    class="flex items-center justify-center p-2 rounded bg-grey-150"
                  >
                    <f-svg-icon
                      iconName="file"
                      size="20"
                      class="text-grey-600"
                    />
                  </div>
                  <div class="flex flex-col flex-grow pl-2 pr-4 gap-y-1">
                    <p class="font-bold text-body2 text-grey-800 line-clamp-1">
                      {{ u3mFile?.name || '' }}
                    </p>
                    <p class="text-caption text-grey-600">
                      {{ hasPhysicalData ? $t('EE0169') : $t('EE0170') }}
                    </p>
                  </div>
                  <f-svg-icon
                    iconName="delete"
                    size="24"
                    class="cursor-pointer text-grey-600"
                    @click="removeU3mFile"
                  />
                </div>
                <div v-if="!hasPhysicalData">
                  <f-input-checkbox
                    v-model:inputValue="needToGeneratePhysical"
                    :label="$t('EE0171')"
                    binary
                    iconSize="20"
                  />
                </div>
                <f-infobar
                  class="mt-0.5"
                  :notifyType="NOTIFY_TYPE.INFO"
                  :title="$t('EE0172')"
                  :messageText="$t('EE0173', { PP0001: $t('PP0001') })"
                />
              </div>

              <material-u3m-status-block :u3m="material.customU3m">
                <template
                  v-if="material.customU3m.status === U3M_STATUS.COMPLETED"
                  #slot:prepend-item
                >
                  <div class="flex items-center gap-x-2">
                    <p class="w-18 text-caption text-grey-600">
                      {{ $t('DD0057') }}
                    </p>
                    <div class="flex items-center gap-x-2">
                      <div
                        class="flex items-center justify-center p-1 rounded bg-grey-150"
                      >
                        <f-svg-icon
                          iconName="file"
                          size="16"
                          class="text-grey-600"
                        />
                      </div>
                      <p class="text-body2/1.6 text-grey-800 line-clamp-1">
                        {{ material.customU3m.customFileName }}
                      </p>
                    </div>
                  </div>
                </template>
              </material-u3m-status-block>
              <i18n-t
                v-if="material.customU3m.status === UNSUCCESSFUL"
                keypath="WW0140"
                tag="p"
                scope="global"
                class="text-red-400 text-caption/1.6"
              >
                <template #RR0123>
                  <span
                    class="text-cyan-400 ml-0.5 cursor-pointer"
                    @click="openModalSendFeedback"
                  >
                    {{ $t('RR0123') }}
                  </span>
                </template>
              </i18n-t>
            </div>
          </div>
        </template>
      </f-expansion-panel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, inject } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import {
  NOTIFY_TYPE,
  CREATE_EDIT,
  U3M_PROVIDER,
  U3M_STATUS,
  materialU3mSelectServiceKey,
} from '@/utils/constants'
import type { MaterialU3mSelectService } from '@/types'
import { type Material, MaterialU3mStatus } from '@frontier/platform-web-sdk'
import MaterialU3mViewerReactButton from '@/components/common/material/u3m/MaterialU3mViewerReactButton.vue'
import MaterialU3mViewerButton from '@/components/common/material/u3m/MaterialU3mViewerButton.vue'
import MaterialU3mStatusBlock from '@/components/common/material/u3m/MaterialU3mStatusBlock.vue'
import BlockMaterialUploadU3mV2 from '@/components/assets/edit/BlockMaterialUploadU3mV2.vue'
import CustomButton from '@/components/common/material/u3m/CustomButton.vue'
import u3mInstructionImage from '@/assets/images/u3m.png'
import useAssets from '@/composables/useAssets'
import { checkU3mImageExist } from '@/utils/3dViewer/checkU3mImageExist'
import useMaterial from '@/composables/material/useMaterial'
import useMaterialSchema, {
  materialSideSchema,
} from '@/composables/material/useMaterialSchema'
import { z } from 'zod'
import type { FormFieldsMeta } from './types'

interface Props {
  material: Material
  formFieldsMeta: FormFieldsMeta
}

const props = defineProps<Props>()

const { t } = useI18n()
const store = useStore()

// Constants
const { INITIAL, COMPLETED, UNSUCCESSFUL } = MaterialU3mStatus

// Composables
const { createU3m } = useAssets()
const materialSchema = useMaterialSchema()
const materialRef = computed(() => props.material)
const { hasScannedImage } = useMaterial(materialRef)

const u3mSelectService = inject<MaterialU3mSelectService>(
  materialU3mSelectServiceKey
)
if (!u3mSelectService) {
  throw new Error('MaterialU3mSelectService is not provided')
}

// Reactive state
const threeDViewerDisabledMap: {
  [U3M_PROVIDER.CUSTOMER]: boolean
  [U3M_PROVIDER.FRONTIER]: boolean
} = reactive({
  1: false,
  2: false,
})

// Computed properties
const hasU3mQuota = computed<boolean>(
  () => store.getters['polling/hasU3mQuota']
)

const hasFilledRequiredFields = computed(() => {
  const u3mRequiredMaterialSchema = z.object({
    itemNo: materialSchema.shape.itemNo,
    width: materialSchema.shape.width,
    weight: materialSchema.shape.weight,
    faceSide: materialSideSchema
      .pick({ contentList: true, materialType: true })
      .nullable(),
    backSide: materialSideSchema
      .pick({ contentList: true, materialType: true })
      .nullable(),
  })

  const result = u3mRequiredMaterialSchema.safeParse(props.material)
  return result.success
})

const showU3mWarning = computed(() => {
  const { formFieldsMeta } = props
  if (!formFieldsMeta) {
    return false
  }

  return (
    (props.material.u3m.status === INITIAL ||
      props.material.u3m.status === COMPLETED) &&
    (formFieldsMeta.itemNoMeta?.dirty ||
      formFieldsMeta.widthMeta?.dirty ||
      formFieldsMeta.weightMeta?.dirty ||
      formFieldsMeta.faceSideMaterialTypeMeta?.dirty ||
      formFieldsMeta.faceSideWarpDensityMeta?.dirty ||
      formFieldsMeta.faceSideWeftDensityMeta?.dirty ||
      formFieldsMeta.faceSideWarpYarnSizeMeta?.dirty ||
      formFieldsMeta.faceSideWeftYarnSizeMeta?.dirty ||
      formFieldsMeta.faceSideContentListMeta?.dirty ||
      formFieldsMeta.backSideMaterialTypeMeta?.dirty ||
      formFieldsMeta.backSideWarpDensityMeta?.dirty ||
      formFieldsMeta.backSideWeftDensityMeta?.dirty ||
      formFieldsMeta.backSideWarpYarnSizeMeta?.dirty ||
      formFieldsMeta.backSideWeftYarnSizeMeta?.dirty ||
      formFieldsMeta.backSideContentListMeta?.dirty)
  )
})

const showU3mRegenerateInfo = computed(() => {
  return props.material.u3m.isNotifyReCreate
})

// Methods
const handleCreateU3m = () => {
  createU3m.func(props.material)
}

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
  })
}

const disabledTooltipErrorMessage = (type: U3M_PROVIDER) => {
  if (props.material.u3m.status === U3M_STATUS.COMPLETED) {
    return !threeDViewerDisabledMap[type]
  } else {
    return true
  }
}

const disabledTooltipCostomerErrorMessage = (type: U3M_PROVIDER) => {
  if (props.material.customU3m.status === U3M_STATUS.COMPLETED) {
    return !threeDViewerDisabledMap[type]
  } else {
    return true
  }
}
const { u3mFile, hasPhysicalData, hasUploadedU3mFile, removeU3mFile, needToGeneratePhysical } =
  u3mSelectService

// Lifecycle
onMounted(async () => {
  threeDViewerDisabledMap[U3M_PROVIDER.FRONTIER] = await checkU3mImageExist(
    props.material?.u3m
  )
  threeDViewerDisabledMap[U3M_PROVIDER.CUSTOMER] = await checkU3mImageExist(
    props.material?.customU3m
  )
})
</script>
