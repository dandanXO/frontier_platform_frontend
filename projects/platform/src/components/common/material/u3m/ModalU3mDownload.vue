<template lang="pug">
modal-behavior(
  :header="$t('RR0059')"
  :primaryBtnText="isShowDisallowedList ? $t('UU0059') : ''"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="multipleDownloadU3m(selectedU3mFormat)"
  @click:secondary="store.dispatch('helper/clearModalPipeline')"
)
  div(v-if="isMultiple && isShowDisallowedList" class="w-94")
    div(class="text-grey-900 text-caption mb-2.5 leading-1.6") {{ $t('EE0108') }}
    f-scrollbar-container(class="max-h-89.5 -mx-5 px-5")
      div(
        v-for="(material, index) in disallowedList"
        :key="material.materialId"
        class="flex gap-3 border-grey-250 py-2.5 text-body2 text-grey-900 leading-1.6"
        :class="{ 'border-b': index !== disallowedList.length - 1 }"
      )
        div(class="w-31 pl-15 font-bold flex-shrink-0") {{ index + 1 }}
        div {{ material.itemNo }}
  div(v-show="!isShowDisallowedList" class="w-92.5 h-49")
    f-tabs(
      ref="refTab"
      :initValue="defaultTab"
      :tabList="tabList"
      keyField="id"
    )
    material-u3m-download-button(
      class="my-3"
      :isMultiple="isMultiple"
      :hasPhysicalData="hasPhysicalData"
      :status="status"
      @download="downloadHandler"
    )
    material-u3m-status-block(
      v-if="!isMultiple"
      :u3m="materialU3mDownloadItemList[0].u3m"
    )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import MaterialU3mStatusBlock from '@/components/common/material/u3m/MaterialU3mStatusBlock.vue'
import MaterialU3mDownloadButton from '@/components/common/material/u3m/MaterialU3mDownloadButton.vue'
import { MaterialU3mStatus } from '@frontier/platform-web-sdk'
import { U3M_PROVIDER, U3M_STATUS, U3M_DOWNLOAD_PROP } from '@/utils/constants'
import { downloadDataURLFile } from '@frontier/lib'
import useLogSender from '@/composables/useLogSender'
import { useStore } from 'vuex'
import { FTabs } from '@frontier/ui-component'
import JSZip from 'jszip'
import useU3mDownloadTabs from '@/composables/material/useU3mDownloadTabs'

interface MaterialU3mItem {
  materialId: number
  itemNo: string
  u3m: MaterialU3m
  customU3m: MaterialCustomU3m
}

interface MaterialU3mDownloadItem {
  materialId: number
  itemNo: string
  u3m: MaterialU3m | MaterialCustomU3m
}

export interface PropsModalU3mDownload {
  materialU3mList: MaterialU3mItem[]
}

const props = defineProps<PropsModalU3mDownload>()

const logSender = useLogSender()
const store = useStore()

const { refTab, tabList, currentTab } = useU3mDownloadTabs()
const defaultTab = computed(() => {
  const hasAtLeastOneU3m = props.materialU3mList.some(
    (material) => material.u3m?.status === U3M_STATUS.COMPLETED
  )
  const hasAtLeastOneCustomU3m = props.materialU3mList.some(
    (material) => material.customU3m?.status === U3M_STATUS.COMPLETED
  )

  if (hasAtLeastOneU3m) {
    return U3M_PROVIDER.FRONTIER
  }

  if (hasAtLeastOneCustomU3m) {
    return U3M_PROVIDER.CUSTOMER
  }

  return U3M_PROVIDER.FRONTIER
})

const materialU3mDownloadItemList = computed<MaterialU3mDownloadItem[]>(() =>
  props.materialU3mList.map((material) => {
    const u3m =
      currentTab.value === U3M_PROVIDER.FRONTIER
        ? material.u3m
        : material.customU3m

    return {
      materialId: material.materialId!,
      itemNo: material.itemNo!,
      u3m,
    }
  })
)

const isMultiple = computed(() => materialU3mDownloadItemList.value.length > 1)

const disallowedList = computed(() =>
  materialU3mDownloadItemList.value.filter(
    (item) => item.u3m.status !== MaterialU3mStatus.COMPLETED
  )
)

const status = computed(() => {
  if (isMultiple.value) {
    return materialU3mDownloadItemList.value.some(
      ({ u3m }) => u3m.status === MaterialU3mStatus.COMPLETED
    )
      ? MaterialU3mStatus.COMPLETED
      : MaterialU3mStatus.INITIAL
  }

  return materialU3mDownloadItemList.value[0].u3m.status
})

const hasPhysicalData = computed(() =>
  isMultiple.value
    ? true
    : materialU3mDownloadItemList.value[0].u3m?.hasPhysicalData ?? false
)

const multipleDownloadU3m = async (format: U3M_DOWNLOAD_PROP) => {
  /**
   * use JSZip to create a zip file and add all allowed u3m files into it
   */
  const zip = new JSZip()
  const addFileToZip = (url: string) => {
    const fileName = url.split('/')[url.split('/').length - 1]
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        zip.file(decodeURIComponent(fileName), blob)
      })
  }

  store.dispatch('helper/pushModalLoading')

  await Promise.all(
    materialU3mDownloadItemList.value
      .filter(({ u3m }) => u3m.status === MaterialU3mStatus.COMPLETED)
      .map(({ u3m }) => addFileToZip(u3m[format]!))
  )
  const content = await zip.generateAsync({ type: 'blob' })
  downloadDataURLFile(
    URL.createObjectURL(content),
    'Frontier_3D materials downloaded.zip'
  )

  store.dispatch('helper/closeModalLoading')
}

const isShowDisallowedList = ref(false)
const selectedU3mFormat = ref<U3M_DOWNLOAD_PROP>(U3M_DOWNLOAD_PROP.U3M)

const downloadHandler = (format: U3M_DOWNLOAD_PROP) => {
  selectedU3mFormat.value = format
  if (!isMultiple.value) {
    const { materialId, u3m } = materialU3mDownloadItemList.value[0]
    const url = u3m[format]!
    const fileName = url.split('/')[url.split('/').length - 1]
    downloadDataURLFile(url, fileName)
    logSender.createDownloadLog(materialId, format)
  } else {
    if (disallowedList.value.length > 0) {
      isShowDisallowedList.value = true
    } else {
      multipleDownloadU3m(selectedU3mFormat.value)
    }
  }
}
</script>
