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
        div {{ material.materialNo }}
  div(v-show="!isShowDisallowedList" class="w-92.5 h-49")
    f-tabs(ref="refTab" :tabList="tabList" keyField="id")
    material-u3m-download-button(
      class="my-3"
      :materialId="materialU3mDownloadItemList[0].materialId"
      :u3m="selectedU3m"
      :downloadHandler="downloadHandler"
      :isMultiple="isMultiple"
    )
    material-u3m-status-block(v-if="!isMultiple" :u3m="selectedU3m")
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import MaterialU3mStatusBlock from '@/components/common/material/u3m/MaterialU3mStatusBlock.vue'
import MaterialU3mDownloadButton from '@/components/common/material/u3m/MaterialU3mDownloadButton.vue'
import type { Material } from '@frontier/platform-web-sdk'
import type { DownloadU3mPayload } from '@/types'
import { U3M_STATUS } from '@/utils/constants'
import { downloadDataURLFile } from '@/utils/fileOperator'
import useLogSender from '@/composables/useLogSender'
import { useStore } from 'vuex'
import { U3M_PROVIDER, U3M_DOWNLOAD_PROP } from '@/utils/constants'
import FTabs from '@frontier/ui-component/src/FTabs/FTabs.vue'

const logSender = useLogSender()
const store = useStore()

const props = defineProps<{
  materialList: Material[]
}>()

const refTab = ref<InstanceType<typeof FTabs>>()
const tabList = ref([
  {
    id: U3M_PROVIDER.FRONTIER,
    name: 'Created in Frontier',
  },
  {
    id: U3M_PROVIDER.CUSTOMER,
    name: 'Customized',
  },
])
const currentTab = computed<U3M_PROVIDER>(
  () => refTab.value?.currentTab || tabList.value[0].id
)

interface MaterialU3mDownloadItem {
  materialId: number
  materialNo: string
  u3m: MaterialU3m | MaterialCustomU3m
}

const materialU3mDownloadItemList = computed<MaterialU3mDownloadItem[]>(() =>
  props.materialList.map((material) => {
    const u3m =
      currentTab.value === U3M_PROVIDER.FRONTIER
        ? material.u3m!
        : material.customU3m!

    return {
      materialId: material.materialId!,
      materialNo: material.materialNo!,
      u3m,
    }
  })
)

const isMultiple = computed(() => materialU3mDownloadItemList.value.length > 1)
const allowedList = computed(() =>
  materialU3mDownloadItemList.value.filter(
    (item) => item.u3m.status === U3M_STATUS.COMPLETED
  )
)
const disallowedList = computed(() =>
  materialU3mDownloadItemList.value.filter(
    (item) => item.u3m.status !== U3M_STATUS.COMPLETED
  )
)

const selectedU3m = computed<MaterialU3m | MaterialCustomU3m>(() => {
  if (isMultiple.value) {
    return {
      status: U3M_STATUS.COMPLETED,
      hasPhysicalData: true,
      createDate: 0,
    }
  }

  return materialU3mDownloadItemList.value[0].u3m
})

const downloadU3m = (materialId: number, url: string, format: string) => {
  const fileName = url.split('/')[url.split('/').length - 1]
  downloadDataURLFile(url, fileName)
  logSender.createDownloadLog(materialId, format)
}

const multipleDownloadU3m = (format: U3M_DOWNLOAD_PROP) => {
  allowedList.value.forEach((material) => {
    setTimeout(() => {
      downloadU3m(material.materialId!, material.u3m[format]!, format)
    }, 0)
  })
}

const isShowDisallowedList = ref(false)
const selectedU3mFormat = ref<U3M_DOWNLOAD_PROP>(U3M_DOWNLOAD_PROP.U3M)

const downloadHandler = ({ materialId, url, format }: DownloadU3mPayload) => {
  selectedU3mFormat.value = format
  if (!isMultiple.value) {
    downloadU3m(materialId, url, selectedU3mFormat.value)
  } else {
    if (disallowedList.value.length > 0) {
      isShowDisallowedList.value = true
    } else {
      multipleDownloadU3m(selectedU3mFormat.value)
    }
  }
}
</script>
